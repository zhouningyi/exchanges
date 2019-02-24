// const Utils = require('./utils');
// const deepmerge = require('deepmerge');
const crypto = require('crypto');
const _ = require('lodash');
const error = require('./errors');
const Base = require('./../base');
const kUtils = require('./utils');
const Utils = require('./../../utils');
const request = require('./../../utils/request');
// const { exchangePairs } = require('./../data');
const { USER_AGENT, WS_BASE } = require('./config');
const okConfig = require('./meta/api');
const future_pairs = require('./meta/future_pairs.json');

//
const { checkKey } = Utils;
//

// function mergeArray(data, d) {
//   return data.concat(data, d);
// }

function merge(data, d) {
  return { ...data, ...d };
}

const URL = 'https://www.okex.com/api';
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.url = URL;
    this.version = 'v3';
    this.name = 'okex';
    this.init();
  }
  async init() {
    this.Utils = kUtils;
    this.loadFnFromConfig(okConfig);
    this.initWs();
  }
  getSignature(method, time, endpoint, params, isws = false) {
    method = method.toUpperCase();
    const paramStr = method === 'GET' ? Utils.getQueryString(params) : JSON.stringify(params);
    const sign = method === 'GET' ? '?' : '';
    const root = isws ? '' : 'api/';
    const totalStr = [`${time}${method}/${root}${endpoint}`, paramStr].filter(d => d).join(sign);// paramStr
    return crypto.createHmac('sha256', this.apiSecret).update(totalStr).digest('base64');// .toString('base64');
  }
  _getTime() {
    return new Date().toISOString();
  }
  getPairs(o = {}) {
    return o.pairs || future_pairs;
  }
  //
  initWs(o = {}) {
    if (!this.ws) {
      try {
        this.ws = kUtils.ws.genWs(WS_BASE, { proxy: this.proxy });
        this.loginWs();
      } catch (e) {
        console.log('initWs error');
        process.exit();
      }
    }
    this.wsFutureIndex = (o, cb) => this._addChanelV3('futureIndex', { pairs: this.getPairs(o) }, cb);
    this.wsTicks = (o, cb) => this._addChanelV3('ticks', { pairs: this.getPairs(o) }, cb);
    this.wsFutureDepth = (o, cb) => this._addChanelV3('futureDepth', { ...o, pairs: this.getPairs(o) }, cb);
    this.wsFutureTicks = (o, cb) => this._addChanelV3('futureTicks', { pairs: this.getPairs(o), contract_type: o.contract_type }, cb);
    this.wsFuturePosition = (o, cb) => this._addChanelV3('futurePosition', o, cb);
    this.wsFutureBalance = (o, cb) => this._addChanelV3('futureBalance', o, cb);
    this.wsFutureOrders = (o, cb) => this._addChanelV3('futureOrders', o, cb);
    this.wsOrders = (o, cb) => this._addChanelV3('orders', o, cb);
    this.wsDepth = (o, cb) => this._addChanelV3('depth', { pairs: this.getPairs(o) }, cb);
    this.wsBalance = (o, cb) => this._addChanelV3('balance', o, cb);
    this.wsSwapTicks = (o, cb) => this._addChanelV3('swapTicks', o, cb);
    this.wsSwapDepth = (o, cb) => this._addChanelV3('swapDepth', o, cb);
  }
  _addChanelV3(wsName, o = {}, cb) {
    const { ws } = this;
    const fns = kUtils.ws[wsName];
    if (fns.notNull) checkKey(o, fns.notNull);
    if (!ws || !ws.isReady()) return setTimeout(() => this._addChanelV3(wsName, o, cb), 100);
    if (fns.isSign && !this.isWsLogin) return setTimeout(() => this._addChanelV3(wsName, o, cb), 100);

    let chanel = fns.chanel(o);
    if (Array.isArray(chanel)) chanel = kUtils.ws.getChanelObject(chanel);
    //
    const validate = res => _.get(res, 'table') === fns.name;
    //
    ws.send(chanel);
    const callback = this.genWsDataCallBack(cb, fns.formater);
    ws.onData(validate, callback);
  }
  genWsDataCallBack(cb, formater) {
    return (ds) => {
      if (!ds) return [];
      const error_code = _.get(ds, 'error_code') || _.get(ds, '0.error_code') || _.get(ds, '0.data.error_code');
      if (error_code) {
        const str = `${ds.error_message || error.getErrorFromCode(error_code)} | [ws]`;
        throw new Error(str);
      }
      cb(formater(ds));
    };
  }
  loginWs() {
    if (!this.apiSecret) return;
    const t = `${Date.now() / 1000}`;
    const endpoint = 'users/self/verify';
    const sign = this.getSignature('GET', t, endpoint, {}, true);
    const chanel = { op: 'login', args: [this.apiKey, this.passphrase, t, sign] };
    const { ws } = this;
    if (!ws || !ws.isReady()) return setTimeout(() => this.loginWs(), 100);
    ws.send(chanel);
    ws.onLogin(() => {
      this.isWsLogin = true;
    });
  }
  _genHeader(method, endpoint, params) {
    const time = this._getTime();
    return {
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
      'OK-ACCESS-KEY': this.apiKey,
      'OK-ACCESS-SIGN': this.getSignature(method, time, endpoint, params),
      'OK-ACCESS-TIMESTAMP': `${time}`,
      'OK-ACCESS-PASSPHRASE': this.passphrase
    };
  }
  async request(method = 'GET', endpoint, params = {}, isSign = false) {
    params = Utils.cleanObjectNull(params);
    params = _.cloneDeep(params);
    const qstr = Utils.getQueryString(params);
    let url;
    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else {
      url = `${URL}/${endpoint}`;
    }
    if (method === 'GET' && qstr) url += `?${qstr}`;
    const o = {
      uri: url,
      proxy: this.proxy,
      method,
      headers: this._genHeader(method, endpoint, params),
      ...(method === 'GET' ? {} : { body: JSON.stringify(params) })
    };
    let body;
    try {
      body = await request(o);
    } catch (e) {
      if (e) console.log(e.message);
      return false;
    }
    if (!body) {
      console.log(`${endpoint}: body 返回为空...`);
      return false;
    }
    if (body.code === 500) {
      console.log(`${endpoint}: code 500, 服务拒绝...`);
      return false;
    }
    if (body.code === -1) {
      console.log(`${endpoint}: ${body.msg}`);
      return false;
    }
    if (body.error_code) {
      const msg = `${error.getErrorFromCode(body.error_code)}`;
      console.log(`${msg} | ${endpoint}`, endpoint, params);
      return Utils.throwError(msg);
    }
    if (body.error_message) {
      return Utils.throwError(body.error_message);
    }
    return body.data || body || false;
  }
  calcCost(o = {}) {
    checkKey(o, ['source', 'target', 'amount']);
    let { source, target, amount } = o;
    const outs = { BTC: true, ETH: true, USDT: true };
    source = source.toUpperCase();
    target = target.toUpperCase();
    if ((source === 'OKB' && !(target in outs)) || (target === 'OKB' && !(source in outs))) return 0;
    return 0.002 * amount;
  }
  // calcCostFuture(o = {}) {
  //   checkKey(o, ['coin', 'side', 'amount']);
  //   const { coin, amount, side = 'BUY' } = o;
  // }
}

module.exports = Exchange;

