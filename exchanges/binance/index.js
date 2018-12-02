// const Utils = require('./utils');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const _ = require('lodash');
const Utils = require('./../../utils');
const tUtils = require('./utils');
const WebSocket = require('ws');

const { checkKey } = Utils;
//
const REST_URL = 'https://api.binance.com/api';
const USER_AGENT = 'Mozilla/4.0 (compatible; Node Binance API)';
const CONTENT_TYPE = 'application/x-www-form-urlencoded';
const WS_BASE = 'wss://stream.binance.com:9443/stream?streams=';
//
const subscribe = Utils.ws.genSubscribe(WS_BASE);

class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.name = 'binance';
    this.init();
  }
  getSignature(qs) {
    return crypto.createHmac('sha256', this.apiSecret).update(qs).digest('hex');
  }
  async init() {
    const waitTime = 1000 * 60 * 5;
    const pairs = await this.pairs();
    tUtils.updatePairs(pairs);
    await Utils.delay(waitTime);
    await this.init();
  }
  testOrder(o) {
    return tUtils.testOrder(o);
  }
  async time() {
    const d = await this.get('time');
    return d ? { time: d.serverTime } : null;
  }
  async kline(o) {
    checkKey(o, ['pair']);
    const ds = await this.get('v1/klines', o, false);
    return tUtils.formatKline(ds, o);
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
    if (!opt) return;
    const ds = await this.post('v3/order', opt, true, true);
    if (ds) {
      Utils.print(`${opt.side} - ${o.pair} - ${ds.executedQty}/${o.amount}`, 'red');
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
        order_id: ds.order_id,
        pair: o.pair,
        side: o.side
      });
      return ds;
    }
    return ds;
  }
  async cancelOrder(o) {
    checkKey(o, ['order_id', 'side']);
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
        order_id: d.order_id,
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
  async balances(o = {}) {
    const ds = await this.get('v3/account', {}, true, true);
    return tUtils.formatBalances(_.get(ds, 'balances'), o);
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
    //
    let body;
    try {
      // console.log('request', o);
      body = await request(o);
      // console.log(body, 'body...');
      // if (url.indexOf('order') !== -1) {
      //   console.log(body, 'body');
      // }
    } catch (e) {
      if (e) console.log('request...', e.message || e);
      return null;
    }
    const { error, msg, code } = body;
    if (code) {
      Utils.print(msg, 'gray');
      throw msg;
    }
    if (error) throw error;
    return body.data || body;
  }
  //
  wsTicks(o, cb) {
    const { proxy } = this;
    subscribe('!ticker@arr', (data = {}) => {
      data = data.data;
      if (!data) return console.log(`${'wsTicks'}数据为空....`);
      data = tUtils.formatTicksWS(data);
      cb(data);
    }, { proxy });
  }
  //
  calcCost(o = {}) {
    checkKey(o, ['source', 'target', 'amount']);
    return o.amount * 0.0015;
  }
}

module.exports = Exchange;
