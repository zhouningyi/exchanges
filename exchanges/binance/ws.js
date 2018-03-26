// const Utils = require('./utils');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const _ = require('lodash');
const Utils = require('./../../utils');
const tUtils = require('./utils');

const { checkKey } = Utils;
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
    return tUtils.formatTicks(ds);
  }
  async order(o) {
    const opt = tUtils.formatOrderO(o);
    const ds = await this.post('v3/order', opt, true, true);
    if (ds) {
      console.log(ds);
      Utils.print(`${opt.side} - ${o.pair} - ${ds.ex}/${o.quantity}`, 'red');
    }
    return ds;
  }
  async fastOrder(o) {
    checkKey(o, ['amount', 'side', 'pair']);
    const waitTime = 200;
    const ds = await this.order(o);
    if (!ds) return;
    if (ds.status === 'NEW') {
      await Utils.delay(waitTime);
      await this.cancelOrder({
        orderId: ds.orderId,
        pair: o.pair,
        side: o.side
      });
      return ds;
    }
    return ds;
  }
  async cancelOrder(o) {
    checkKey(o, ['orderId', 'side']);
    o = tUtils.formatCancelOrderO(o);
    const ds = await this.delete('v3/order', o, true, true);
    return ds;
  }
  async activeOrders(o = {}) {
    const ds = await this.get('v3/openOrders', o, true, true);
    return tUtils.formatActiveOrders(ds);
  }
  async cancelAllOrders(o = {}) {
    const ds = await this.activeOrders();
    await Promise.all(_.map(ds, async (d) => {
      const opt = {
        orderId: d.orderId,
        pair: d.pair,
        side: d.side
      };
      await this.cancelOrder(opt);
    }));
  }
  async pairs(o = {}) {
    const ds = await this.get('v1/exchangeInfo', o);
    return tUtils.formatPairs(_.get(ds, 'symbols'));
  }
  async orderBook(o = {}) {
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

    // console.log(o, 'o');
    try {
      const body = await request(o);
      if (url.indexOf('order') !== -1) {
        console.log(body, 'body');
        // process.exit();
      }
      const { error, msg, code } = body;
      if (code) {
        console.log(msg);
        throw msg;
      }
      if (error) throw error;
      return body.data || body;
    } catch (e) {
      if (e.stack) console.log(e.stack);
      return null;
    }
  }
}

module.exports = Exchange;
