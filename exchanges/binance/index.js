// const Utils = require('./utils');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const _ = require('lodash');
const Utils = require('./../../utils');
const tUtils = require('./utils');
//
const REST_URL = 'https://api.binance.com/api';
const USER_AGENT = 'Mozilla/4.0 (compatible; Node Binance API)';
const CONTENT_TYPE = 'application/x-www-form-urlencoded';
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
  }
  getSignature(qs) {
    return crypto.createHmac('sha256', this.apiSecret).update(qs).digest('hex');
  }
  async time() {
    return await this.get('time');
  }
  async kline(o) {
    const ds = await this.get('v1/klines', o, false);
    return tUtils.formatKline(ds);
  }
  async get(endpoint, params, signed, isTimestamp) {
    return await this.request('GET', endpoint, params, signed, isTimestamp);
  }
  async post(endpoint, params, signed, isTimestamp) {
    return await this.request('POST', endpoint, params, signed, isTimestamp);
  }
  async delete(endpoint, params, signed, isTimestamp) {
    return await this.request('DELETE', endpoint, params, signed, isTimestamp);
  }
  async prices(o = {}) {
    const ds = await this.get('v3/ticker/price', o, false);
    return ds;
  }
  async ticks(o = {}) {
    const ds = await this.get('v3/ticker/bookTicker', o);
    return ds;
  }
  // async order(o) {
  // }
  // async activeOrders(o = {}) {
  //   return await this.get('v3/openOrders', o, true);
  // }
  async pairs(o = {}) {
    const ds = await this.get('v1/exchangeInfo', o);
    return tUtils.formatPairs(_.get(ds, 'symbols'));
  }
  async orders(o = {}) {
    return await this.get('v3/allOrders', o, true, true);
  }
  async depth(o = {}) {
    o = { limit: 20, ...o };
    const ds = await this.get('v1/depth', o);
    return tUtils.formatDepth(ds);
  }
  async ping() {
    const ds = await this.get('v1/ping');
    return !!ds;
  }
  async balances() {
    const ds = await this.get('v3/account', {}, true, true);
    return tUtils.formatBalances(_.get(ds, 'balances'));
  }
  async request(method = 'GET', endpoint, params = {}, signed, isTimestamp) {
    const { options } = this;
    params = tUtils.formatPair(params);
    const nonce = new Date().getTime();
    if (signed) params = { recvWindow: options.timeout || params.timeout, ...params };
    if (isTimestamp) params.timestamp = nonce;
    let base = `${REST_URL}/${endpoint}`;
    const qstr = Utils.getQueryString(params, true);
    base = (qstr || signed) ? `${base}?` : base;
    const url = signed ? `${base}${qstr}&signature=${this.getSignature(qstr)}` : `${base}${qstr}`;
    const o = {
      timeout: options.timeout,
      uri: url,
      proxy: this.proxy,
      method,
      headers: {
        'Content-Type': CONTENT_TYPE,
        ...(signed ? {
          'User-Agent': USER_AGENT,
          'X-MBX-APIKEY': this.apiKey
        } : {})
      }
    };

    // console.log(o);
    const body = await request(o);
    // console.log(body);
    const { error, msg, code } = body;
    if (code) throw msg;
    if (error) throw error;
    return body.data || body;
  }
}

module.exports = Exchange;
