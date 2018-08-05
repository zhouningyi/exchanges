const Utils = require('./../utils');
// const bUtils = require('./../../utils');
const Event = require('bcore/event');
const _ = require('lodash');
// const config = require('./../config');
const deepmerge = require('deepmerge');
const argv = require('optimist').argv;
const fs = require('fs');
const path = require('path');

const { delay } = Utils;
const isProxy = !!argv.proxy;

const defaultOptions = {
  timeout: 10000,
};

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
  async get(endpoint, params, isSign) {
    return await this.request('GET', endpoint, params, isSign);
  }
  async post(endpoint, params, isSign) {
    return await this.request('POST', endpoint, params, isSign);
  }
  async delete(endpoint, params, isSign) {
    return await this.request('DELETE', endpoint, params, isSign);
  }
  // 保存配置
  _getConifgPath(file, ext = 'json') {
    return path.join(__dirname, `./${this.name}/meta/${file}.${ext}`);
  }
  saveConfig(json = {}, file) {
    if (isEmptyObject(json)) return this.print(`输入为空，无法写入文件${file}...`);
    const pth = this._getConifgPath(file);
    const str = JSON.stringify(json, null, 2);
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
}

module.exports = exchange;
