const Utils = require('./../utils');
const Event = require('bcore/event');
const _ = require('lodash');
// const config = require('./../config');
const deepmerge = require('deepmerge');
const argv = require('optimist').argv;
const fs = require('fs');
const path = require('path');
const { map } = require('lodash');
const ef = require('./../utils/formatter');
const { upperFirst } = require('lodash');

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
    const { apiKey, apiSecret, passphrase, unique_id, otc_id, name_cn, role, spot_id } = config;
    this.config = config;
    this.options = deepmerge(defaultOptions, options);
    this.role = role;
    this.name_cn = name_cn || unique_id;
    this.passphrase = passphrase;
    this.apiSecret = apiSecret;
    this.apiKey = apiKey;
    this.otc_id = otc_id;
    this.spot_id = spot_id;
    this.unique_id = unique_id;
    this.proxy = isProxy ? 'http://127.0.0.1:1087' : null;
    this.resp_time_n = 500;
    if (this.compatible) this.compatible();
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
  p(p) {
    return Math.random() < Math.abs(p);
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
  async put(endpoint, params, isSign = true, hostId) {
    return await this.request('PUT', endpoint, params, isSign, hostId);
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
  uuid(name) {
    const tlong = new Date().getTime();
    return `${name}_${Math.floor(tlong / 1000)}_${Math.floor(Math.random() * 10000)}`;
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

  getEndPoint(endpoint, endpointParams, params, opt, { delEndParams }) { // api/margin/v3/cancel_orders/<order-id>，填充order-id
    if (!endpointParams || !endpointParams.length) return endpoint;
    endpoint = _.template(endpoint)(params);
    _.forEach(endpointParams, (k) => {
      delete params[k];
      if (delEndParams) delete opt[k];
    });
    return endpoint;
  }
  updateApiInfo(conf) {
    const id = conf.endpoint;
    const name_cn = conf.name_cn || conf.name;
    const name = conf.name;
    const apiMap = this.apiMap = this.apiMap || {};
    apiMap[conf.endpoint] = apiMap[conf.endpoint] || { id, name, name_cn, count: 0 };
  }
  updateLockInfo(conf) {
    this.updateApiInfo(conf);
  }
  updateErrorInfo(conf, message = '') {
    this.updateApiInfo(conf);
    const line = this.apiMap[conf.endpoint];
    line.error_count = line.error_count ? line.error_count + 1 : 1;
    const error = message || conf.error || '?';
    const error_id = conf.endpoint + error;
    const errorMap = this.errorMap = this.errorMap || {};
    const errorLine = errorMap[error_id] = errorMap[error_id] || { api: conf.endpoint, api_name: conf.name_cn || conf.name, error, count: 0 };
    errorLine.count += 1;
  }
  updateMeanRespTime(conf, resp_time) {
    this.updateApiInfo(conf);
    const { resp_time_n, apiMap } = this;
    const q = 1 / resp_time_n;
    const p = 1 - q;
    //
    const line = apiMap[conf.endpoint];
    line.resp_time = (line.resp_time || resp_time) * p + q * resp_time;
    line.count += 1;
    //
    this.mean_resp_time = (this.mean_resp_time || resp_time) * p + q * resp_time;
  }
  getErrorMap() {

  }
  getMeanRespTime() {
    return this.mean_resp_time;
  }
  getApiSummary() {
    const res = _.map(this.apiMap);
    this.mergeLockFns(res);
    return _.sortBy(res, d => -d.resp_time);
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
  addFnLock(conf, query_id) {
    const apiLockMap = this.apiLockMap = this.apiLockMap || {};
    apiLockMap[query_id] = { ...conf };
    // const line = apiLockMap[query_id] = || { ...conf, count: 0 };
  }
  cancelFnLock(conf, query_id) {
    delete this.apiLockMap[query_id];
  }
  mergeLockFns(map) {
    const groups = _.groupBy(this.apiLockMap, 'endpoint');
    _.forEach(map, (l) => {
      const arr = groups[l.id];
      l.lock_count = arr ? arr.length : 0;
    });
  }
  async queryFunc({ method, endpointCompile, opt, sign, host }) {
    return await this[method](endpointCompile, opt, sign, host);
  }
  wrapperInfo(ds) {
    const api_key = this.apiKey;
    const exchange = this.name.toUpperCase();
    if (!api_key || !ds) return ds;
    if (Array.isArray(ds)) return map(ds, d => ({ ...d, api_key, exchange }));
    return { ...ds, api_key, exchange };
  }
  updateAddOnInfo(ds) {
    if (!ds || ds.error) return ds;
    if (!Array.isArray(ds)) ds = [ds];
    const exchange = this.name ? this.name.toUpperCase() : null;
    for (const d of ds) {
      if (exchange) {
        d.exchange = exchange;
      }
    }
    return ds;
  }
  loadFn(conf = {}, key) {
    const UtilsInst = this.utils || this.Utils;
    if (!UtilsInst) Utils.warnExit(`${this.name}: this.Utils缺失`);
    checkKey(conf, ['endpoint', 'name', 'name_cn']);
    const resultChecker = ef.genChecker(conf);
    const { name = key, notNull: checkKeyO, endpoint, sign = true, endpointParams, delEndParams } = conf;
    const formatOFn = UtilsInst[`${key}O`] || (d => d);
    // if (!formatOFn) Utils.warnExit(`${this.name}: Utils.${key}O()不存在`);
    const formatFn = UtilsInst[key];
    if (!formatOFn) Utils.warnExit(`${this.name}: Utils.${key}()不存在`);
    const method = (conf.method || 'get').toLowerCase();
    const defaultOptions = conf.defaultOptions || {};
    this[name] = async (o, cb) => {
      const query_id = this.uuid();
      let queryOption;
      try {
        o = Object.assign({}, defaultOptions, o);
        const t0 = new Date();
        // console.log(conf, o, 'ccc....');
        if (checkKeyO) checkKey(o, checkKeyO, name);
          // 顺序不要调换
        let opt = formatOFn ? _.cloneDeep(formatOFn(o, this.queryOptions)) : _.cloneDeep(o);
        const endO = { ...opt, ...(this.queryOptions || {}) };
        const endpointCompile = this.getEndPoint(endpoint, endpointParams, endO, opt, { delEndParams });
        opt = Utils.cleanObjectNull(opt);
        const tStart = new Date();
        this.addFnLock(conf, query_id);
        queryOption = { method, name, endpointCompile, opt, o, sign, host: conf.host };
        if (conf.type === 'ws') return await this.wsSubscribe(queryOption, cb, { formatFn });
        const ds = await this.queryFunc(queryOption);
        this.cancelFnLock(conf, query_id);
        const dt = new Date() - tStart;
        let errorO;
        if (UtilsInst.getError && ds) {
          const error = UtilsInst.getError(ds);
          if (error) {
            errorO = { ...ds, error };
            const errorEventData = { ...errorO, o, error_type: 'rest_api', exchange: this.name.toUpperCase(), opt, url: endpointCompile, name_cn: conf.name_cn, endpoint: conf.endpoint, name: conf.name, time: new Date() };
            console.log(errorEventData, 'errorEventData....');
            this.updateErrorInfo(errorEventData);
            this.emit('request_error', errorEventData);
          }
        }
        if (!ds) {
          const error = '返回为空...';
          this.updateErrorInfo(conf, error);
          return console.log(conf) && this.throwError(error);
        }
        let res;
        const errorApis = [
          'margin/v3/cancel_batch_orders',
          'margin/v3/orders/{order_id}',
          'spot/v3/orders/{order_id}',
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
        res = this.wrapperInfo(res);
        if (res && res.error)console.log(res.error, endpointCompile, 'response error...');
        this.addDt2Res(res, dt);
        this.updateMeanRespTime(conf, dt);
        this.updateAddOnInfo(res);
        if (resultChecker && res) resultChecker(res);
        return res;
      } catch (e) {
        console.log(e, queryOption, 'ee...');
        this.updateErrorInfo(conf, e ? e.message : '未知错误');
        this.cancelFnLock(conf, query_id);
        return null;
      }
    };
  }
  getExchangeName() {
    return this.name ? this.name.toUpperCase() : null;
  }
  // 组合函数
  registerFn({ name }, cb) {
    const fnName = `asset${upperFirst(name)}`;
    this[fnName] = async (o = {}) => {
      const { assets, ...rest } = o;
      const osGroup = _.groupBy(assets, a => this._getAssetBaseType(a));
      let res = [];
      for (const assetBaseType in osGroup) {
        const _assets = osGroup[assetBaseType];
        const ds = await cb({ ...rest, ...o, assetBaseType, assets: _assets });
        if (Array.isArray(ds))res = [...res, ...ds];
      }
      return res;
    };
  }
  parseAssets(o) {
    let { assets, pair, asset_type } = o;
    if (assets) return assets;
    assets = [];
    if (typeof pair === 'string') pair = [pair];
    if (typeof asset_type === 'string') asset_type = [asset_type];
    for (const _asset_type of asset_type) {
      for (const _pair of pair) {
        assets.push({ asset_type: _asset_type, pair: _pair });
      }
    }
    return assets;
  }
  getName() {
    return this.name ? this.name.toUpperCase() : null;
  }
  compatible() {
    this.assetBatchCancelOrders = async (orders) => {
      const ordersGroup = _.groupBy(orders, d => this._getAssetBaseType(d));
      let res = [];
      for (const baseType in ordersGroup) {
        const orders = ordersGroup[baseType];
        if (orders && orders.length) {
          const realFnName = `${baseType}BatchCancelOrders`;
          if (this[realFnName]) {
            const _res = await this[realFnName](orders);
            if (_res) res = [..._res];
          } else {
            const realFnName = `${baseType}CancelOrder`;
            if (this[realFnName]) {
              for (const order of orders) {
                const _res = await this[realFnName](order);
                if (_res) res.push(_res);
              }
            } else {
              console.log(`缺少方法exchange.${realFnName}`);
            }
          }
        }
      }
      return _.filter(res, d => d && !d.error);
    };
    //
    this.registerFn({ name: 'orders' }, async (o = {}) => {
      const { status, assetBaseType, assets, ...rest } = o;
      const baseFnName = `${assetBaseType}Orders`;
      const fnName = status === 'UNFINISH' ? `${assetBaseType}UnfinishOrders` : baseFnName;
      let fn = this[fnName] || this[baseFnName];
      if (!fn) return console.log(`函数${fnName}不存在...`);
      fn = fn.bind(this);
      let res = [];
      for (const asset of assets) {
        const opt = { ...rest, ...asset };
        if (status) opt.status = status;
        const ds = await fn(opt);
        if (Array.isArray(ds)) res = [...res, ...ds];
      }
      return res;
    });
    //
    const filterBalances = (ds, o) => {
      if (!ds || !o || !o.assets) return ds;
      const exchange = this.getExchangeName();
      const { assets } = o;
      const balance_ids = _.uniqueId([
        _.map(assets, asset => Utils.formatter.getBalanceId({ ...asset, exchange, type: 'left' })),
        _.map(assets, asset => Utils.formatter.getBalanceId({ ...asset, exchange, type: 'right' }))
      ]);
      return _.filter(ds, d => balance_ids.includes(d.balance_id));
    };

    const filterByInstrumentId = (ds, o) => {
      if (!ds || !o || !o.assets) return ds;
      const { assets } = o;
      const exchange = this.getExchangeName();
      const instrument_ids = _.map(assets, asset => Utils.formatter.getInstrumentId({ ...asset, exchange }));
      return _.filter(ds, d => instrument_ids.includes(d.instrument_id));
    };

    const resFns0 = ['balances', 'assets', 'positions', 'ledgers', 'orderDetails'];
    for (const name of resFns0) {
      this.registerFn({ name }, async (o = {}) => {
        const { assetBaseType, ...restOption } = o;
        const { filter_by_asset = true } = restOption;
        // const wsFnName = `wsRequest${upperFirst(assetBaseType)}${upperFirst(name)}`;
        let ds;
        // if (this[wsFnName] && (name !== 'balances')) { // 老不稳定...
        //   ds = await this[wsFnName](restOption);
        // } else {
        const restFnName = `${o.assetBaseType}${upperFirst(name)}`;
        if (this[restFnName]) {
          ds = await this[restFnName](restOption);
        } else if (!['spotPositions', 'spotLedgers'].includes(restFnName)) {
          console.log(`registerFn/${restFnName}不存在...`);
        }
        // }
        if (name === 'balances') return filter_by_asset ? filterBalances(ds, o) : ds;
        if (['positions', 'assets', 'ledgers'].includes(name)) {
          const res = filter_by_asset ? filterByInstrumentId(ds, o) : ds;
          return res;
        }
        console.log(`resFns0/name:${name} UNKNOW...`);
      });
    }

    const restFns = ['order', 'orderInfo', 'kline', 'position', 'balance', 'orderDetails', 'cancelOrder'];
    for (const name of restFns) {
      const fnName = `asset${upperFirst(name)}`;
      this[fnName] = async (o) => {
        const baseType = this._getAssetBaseType(o);
        const realFnName = `${baseType}${upperFirst(name)}`;
        if (this[realFnName]) {
          // if (name === 'order') console.log(name, o, '====name.....');
          const res = await this[realFnName](o);
          return res;
        } else {
          this.print(`compatible: rest函数${realFnName}不存在...`);
        }
      };
    }

    // WS
    const wsFns = ['orders', 'positions', 'balances', 'depth', 'ticks', 'estimateFunding'];
    for (const name of wsFns) {
      const fnName = `subscribeAsset${upperFirst(name)}`;
      this[fnName] = async (o, cb) => {
        const assets = this.parseAssets(o);
        const { filter_by_asset = true } = o;
        const assetsGroup = _.groupBy(assets, this._getAssetBaseType.bind(this));
        for (const assetBaseType in assetsGroup) {
          const realFnName = `ws${upperFirst(assetBaseType)}${upperFirst(name)}`;
          const _assets = assetsGroup[assetBaseType];
          if (this[realFnName]) {
            this[realFnName]({ ...o, assets: _assets }, (ds) => {
              if (name === 'balances') ds = filter_by_asset ? filterBalances(ds, o) : ds;
              if (name === 'positions') ds = filterByInstrumentId(ds, o);
              cb(ds);
            });
          } else {
            this.print(`compatible: ws函数${realFnName}不存在...`);
          }
        }
      };
    }
    //
    if (this._compatible) this._compatible();
  }
}

module.exports = exchange;
