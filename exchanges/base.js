const Utils = require('./../utils');
const Event = require('bcore/event');
const _ = require('lodash');
// const config = require('./../config');
const deepmerge = require('deepmerge');
const argv = require('optimist').argv;
const fs = require('fs');
const path = require('path');

const { delay, checkKey } = Utils;
const isProxy = !!argv.proxy || !!process.env.PROXY;

_.templateSettings.interpolate = /{([\s\S]+?)}/g;

const defaultOptions = {
  timeout: 20000,
};

function _upperFirst(str) {
  return str[0].toUpperCase() + str.substring(1);
}

function stringify(o) {
  return JSON.stringify(o, null, 2);
}

function isEmptyObject(o) {
  if (!o) return true;
  let bol = true;
  _.forEach(o, () => (bol = false));
  return bol;
}


class exchange extends Event {
  constructor(config = {}, options = {}) {
    super();
    const { apiKey, apiSecret, passphrase, unique_id, otc_id, spot_id } = config;
    this.config = config;
    this.options = deepmerge(defaultOptions, options);
    this.passphrase = passphrase;
    this.apiSecret = apiSecret;
    this.apiKey = apiKey;
    this.otc_id = otc_id;
    this.spot_id = spot_id;
    this.unique_id = unique_id;
    this.proxy = isProxy ? 'http://127.0.0.1:1087' : null;
  }
  // io
  getApiKey() {
    return this.apiKey;
  }
  // 工具函数
  print(str, color = 'yellow') {
    str = `${this.name}: ${str}`;
    return Utils.print(str, color);
  }
  warn(str, e) {
    console.log(e);
    this.print(str, 'red');
  }
  warnExit(str, e) {
    this.warn(str, e);
    process.exit();
  }
  // 锁机制
  _getLockName(side, coin = '') {
    return `${side}${coin}Lock`;
  }
  isLock(side, coin = '') {
    const lock = this._getLockName(side, coin);
    return !!this[lock];
  }
  addLock(side, coin = '') {
    const lock = this._getLockName(side, coin);
    this[lock] = true;
  }
  cancelLock(side, coin = '') {
    const lock = this._getLockName(side, coin);
    this[lock] = false;
  }
  // CURD
  async get(endpoint, params, isSign = true, hostId) {
    return await this.request('GET', endpoint, params, isSign, hostId);
  }
  async post(endpoint, params, isSign = true, hostId) {
    return await this.request('POST', endpoint, params, isSign, hostId);
  }
  async delete(endpoint, params, isSign = true, hostId) {
    return await this.request('DELETE', endpoint, params, isSign, hostId);
  }
  // 保存配置
  _getConifgPath(file, ext = 'json') {
    return path.join(__dirname, `./${this.name}/meta/${file}.${ext}`);
  }
  saveConfig(json = {}, file) {
    if (isEmptyObject(json)) return this.print(`输入为空，无法写入文件${file}...`);
    const pth = this._getConifgPath(file);
    const str = stringify(json);
    fs.writeFileSync(pth, str, 'utf8');
  }
  readConfig(file) {
    const pth = this._getConifgPath(file);
    const text = fs.readFileSync(pth, 'utf8');
    return JSON.parse(text);
  }
  // 别名 alias
  async candlestick(o) { // 与kline意义一致
    return await this.kline(o);
  }
  calcCost(o = {}) {
    console.log(`${this.name}没有独立实现calcCost`);
    process.exit();
  }
  // 函数包装
  _getWrapConfig(config = {}) {
    let defaultConfig;
    try {
      defaultConfig = this.readConfig('api');
    } catch (e) {
      this.warnExit('可能未配置wrap (exchange/meta/api.json)', e);
    }
    return { ...defaultConfig, ...config };
  }
  genRateLimitFn(fn, t = 100, fnName) {
    const timeName = `rate_limit_${fnName}`;
    return async function f(a, b, c, d) {
      let ds = false;
      if (this[timeName] && new Date() - this[timeName] < t) {
        await delay(t);
        const ds = await f.bind(this)(a, b, c, d);
        return ds;
      }
      this[timeName] = new Date();
      try {
        ds = await fn(a, b, c, d);
      } catch (e) {
        this.warn(`${fnName} error`, e);
      }
      return ds;
    }.bind(this);
  }
  wrap(config = {}, o = {}) {
    const { isPrint = false } = o;
    config = this._getWrapConfig(config);
    _.forEach(config, (conf, fnName) => {
      let fn = this[fnName];
      if (!fn) this.warnExit(`不存在函数${fnName}`);
      fn = fn.bind(this);
      if (conf.timeout || conf.retry) fn = Utils.wrapFn(fn, conf, isPrint, fnName);
      if (conf.rateLimit) fn = this.genRateLimitFn(fn, conf.rateLimit, fnName);
      this[fnName] = fn;
    });
    return true;
  }
  test() {
    console.log('test');
  }
  throwError(e) {
    throw new Error(e);
  }
  intervalTask(fn, interval) {
    fn = fn.bind(this);
    return async function f() {
      try {
        await fn();
      } catch (e) {
        console.log(e);
      }
      try {
        await delay(interval);
      } catch (e) {
        console.log(e);
      }
      process.nextTick(f);
    };
  }
  loadFnFromConfig(confs) {
    _.forEach(confs, (conf, key) => this.loadFn(conf, key));
  }

  getEndPoint(endpoint, endpointParams, params) { // api/margin/v3/cancel_orders/<order-id>，填充order-id
    if (!endpointParams || !endpointParams.length) return endpoint;
    endpoint = _.template(endpoint)(params);
    _.forEach(endpointParams, (k) => {
      delete params[k];
    });
    return endpoint;
  }
  addDt2Res(res, dt) {
    if (!res) return res;
    if (Array.isArray(res)) {
      _.forEach(res, (l) => {
        if (l) l.resp_time = dt;
      });
    } else if (typeof res === 'object') {
      if (res) res.resp_time = dt;
    }
    return res;
  }
  loadFn(conf = {}, key) {
    const UtilsInst = this.utils || this.Utils;
    if (!UtilsInst) Utils.warnExit(`${this.name}: this.Utils缺失`);
    checkKey(conf, ['endpoint', 'name', 'name_cn']);
    const { name = key, notNull: checkKeyO, endpoint, sign = true, endpointParams } = conf;
    const formatOFn = UtilsInst[`${key}O`] || (d => d);
    // if (!formatOFn) Utils.warnExit(`${this.name}: Utils.${key}O()不存在`);
    const formatFn = UtilsInst[key];
    if (!formatOFn) Utils.warnExit(`${this.name}: Utils.${key}()不存在`);
    const method = (conf.method || 'get').toLowerCase();
    const defaultOptions = conf.defaultOptions || {};
    this[name] = async (o) => {
      try {
        o = Object.assign({}, defaultOptions, o);
        if (checkKeyO) checkKey(o, checkKeyO);
        // 顺序不要调换
        let opt = formatOFn ? _.cloneDeep(formatOFn(o, this.queryOptions)) : _.cloneDeep(o);
        // console.log(this.queryOptions, 'queryOptions...');
        const endpointCompile = this.getEndPoint(endpoint, endpointParams, { ...opt, ...(this.queryOptions || {}) });
        // const strO = `输入options: ${stringify(opt)}`;
        // Utils.print(strO, 'blue');
        opt = Utils.cleanObjectNull(opt);
        // const str1 = `opt: ${stringify(opt)}`;
        // Utils.print(str1, 'gray');
        // const str2 = `${method}: ${endpointCompile}`;
        // Utils.print(str2, 'gray');
        const tStart = new Date();
        // console.log(endpointCompile, opt, sign, method, 'endpointCompile...');
        const ds = await this[method](endpointCompile, opt, sign, conf.host);
        const dt = new Date() - tStart;
        let errorO;
        if (UtilsInst.getError && ds) {
          const error = UtilsInst.getError(ds);
          if (error) {
            errorO = { ...ds, error };
            const errorEventData = { ...errorO, opt, url: conf.endpoint, name_cn: conf.name_cn, name: conf.name, time: new Date() };
            console.log(errorEventData, 'errorEventData....');
            this.emit('request_error', errorEventData);
          }
        }
        if (!ds) return console.log(conf) && this.throwError('返回为空...');
        let res;
        const errorApis = [
          'margin/v3/cancel_batch_orders',
          'margin/v3/orders/{order_id}',
        ];
        if (formatFn) {
          if (!errorO) {
            res = formatFn(ds, o);
          } else if (errorApis.includes(conf.endpoint)) {
            res = formatFn(ds, o, errorO);
          } else {
            return errorO;
          }
        } else {
          res = ds;
        }
        this.addDt2Res(res, dt);
        return res;
      } catch (e) {
        console.log(e);
        return false;
      }
    };
  }
}

module.exports = exchange;
