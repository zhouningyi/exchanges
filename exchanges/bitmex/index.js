// const Utils = require('./utils');
const deepmerge = require('deepmerge');
const crypto = require('crypto');
// const md5 = require('md5');
const _ = require('lodash');
const error = require('./errors');
const Base = require('./../base');
const kUtils = require('./utils');
const Utils = require('./../../utils');
const request = require('./../../utils/request');

// const { exchangePairs } = require('./../data');
const { USER_AGENT, WS_BASE, REST_BASE } = require('./config');
//
const { checkKey } = Utils;
//
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.name = 'bitmex';
    this.version = 'v1';
    this.init();
  }
  async init() {
  }
  async funding() {
    // checkKey(o, ['pair']);
    // const opt = kUtils.pair2symbol(o.pair);
    const defaultO = {
      // symbol: 'XBU:monthly',
      count: 100
    };
    const ds = await this.get('funding', defaultO);
    return kUtils.formatFunding(ds);
  }
  async coins() {
    // const ds = await this.get('account/v3/currencies', {}, false);
    // return kUtils.formatCoin(ds);
  }
  async tick(o = {}) {
    checkKey(o, ['pair']);
    const opt = kUtils.pair2symbol(o.pair);
    const ds = await this.get('orderBook/L2', { symbol: 'XBU' });
    console.log(ds);
  }
  async kline(o = {}) {
  }
  async depth(o = {}) {
  }
  // 交易状态
  async orderInfo(o = {}) {
  }
  async unfinishOrders(o = {}) {
  }
  async successOrders(o = {}) {
    // checkKey(o, ['pair']);
  }
  async balances(o = {}) {
  }
  async wallet(o = {}) {
  }
  // 交易
  async order(o = {}) {
    // checkKey(o, ['pair', 'side', 'type', 'amount']);
    // const opt = kUtils.formatOrderO(o);
    // const ds = await this.post('spot/v3/orders', opt);
    // const res = kUtils.formatOrder(ds, o, 'UNFINISH');
    // return res;
  }
  async cancelOrder(o = {}) {
  }
  async cancelAllOrders(o = {}) {
  }
  getSignature(method, expires, endpoint, params) {
    method = method.toUpperCase();
    let qstr = method === 'GET' ? Utils.getQueryString(params) : '';
    if (qstr) qstr = `?${qstr}`;
    const postData = method === 'GET' ? '' : JSON.stringify(params);
    const totalStr = `${method}/api/v1/${endpoint}${qstr}${expires}${postData}`;
    const str = crypto.createHmac('sha256', this.apiSecret).update(totalStr).digest('hex');
    return str;
  }
  async request(method = 'GET', endpoint, params = {}, isSign = false) {
    params = Utils.cleanObjectNull(params);
    params = _.cloneDeep(params);
    const qstr = Utils.getQueryString(params);
    let url;
    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else {
      url = `${REST_BASE}/${this.version}/${endpoint}`;
    }
    if (method === 'GET' && qstr) url += `?${qstr}`;
    const delayT = 30 * 1000;// 30s in the future
    const expires = new Date().getTime() + delayT;
    const o = {
      uri: url,
      proxy: this.proxy,
      method,
      headers: {
        // 'user-agent': USER_AGENT,
        'content-type': 'application/json',
        accept: 'application/json',
        'api-expires': expires,
        'api-signature': this.getSignature(method, expires, endpoint, params),
        'api-key': this.apiKey
      },
      ...(method === 'GET' ? {} : { body: JSON.stringify(params) })
    };
    let body;
    try {
      console.log(o);
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
      console.log(`${endpoint}: 服务拒绝...`);
      return false;
    }
    if (body.code === -1) {
      console.log(`${endpoint}: ${body.msg}`);
      return false;
    }
    if (body.error_code) {
      console.log(`${error.getErrorFromCode(body.error_code)} | ${endpoint}`, endpoint, params);
      return false;
    }
    return body.data || body || false;
  }
  async pairs(o = {}) {
  }
  //
  // calcCost(o = {}) {
  //   checkKey(o, ['source', 'target', 'amount']);
  //   const { source, target, amount } = o;
  //   return 0.002 * amount;
  // }
}

module.exports = Exchange;

