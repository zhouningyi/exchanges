// const Utils = require('./utils');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const _ = require('lodash');
const kUtils = require('./utils');
const Utils = require('./../../utils');
const md5 = require('md5');
const error = require('./errors');
const { exchangePairs } = require('./../data');
//
const { checkKey } = Utils;
//
const USER_AGENT = 'Mozilla/4.0 (compatible; Node OKEX API)';
const WS_BASE = 'wss://real.okex.com:10441/websocket';
const subscribe = Utils.ws.genSubscribe(WS_BASE);

const URL = 'https://www.okex.com/api';
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.url = URL;
    this.version = 'v1';
  }
  getSignature(params) {
    const qstr = `${Utils.getQueryString({ ...params, api_key: this.apiKey })}&secret_key=${this.apiSecret}`;
    return md5(qstr).toUpperCase();
  }
  async tick(o = {}) {
    const ds = await this.get('ticker', o);
    return kUtils.formatTick(ds);
  }
  async ticks(o = {}) {
    const ds = await this.tick(o);
    return ds;
  }
  async depth(o = {}) {
    const ds = await this.get('depth', o, false);
    return kUtils.formatDepth(ds);
  }
  async orderInfo(o = {}) {
    const { orderId: order_id } = o;
    const ds = await this.get('trades', { order_id }, true, true);
    return ds;
  }
  async activeOrders() {}
  async allOrders() { // 近2天来的order
    await this.post('order_history');
  }
  async cancelAllOrders(o) {
  }
  async cancelOrder(o = {}) {
    checkKey(o, ['orderId', 'pair']);
    o = kUtils.formatCancelOrderO(o);
    await this.post('cancel_order', o);
  }
  async orderBook(o = {}) {
    const ds = await this.get('trades', o, true, true);
    return kUtils.formatOrderBook(ds);
  }
  async balances() {
    const ds = await this.post('userinfo', {}, true);
    return kUtils.formatBalances(ds);
  }
  async order(o = {}) {
    o = kUtils.formatOrderO(o);
    let ds = await this.post('trade', o, true);
    console.log(ds, 'ds...');
    ds = kUtils.formatOrderResult(ds);
    return ds;
  }
  async request(method = 'GET', endpoint, params = {}, isSign = false) {
    params = Utils.replace(params, { pair: 'symbol' });
    if (params.symbol) params.symbol = kUtils.formatPair(params.symbol);
    const signedParams = {
      ...params,
      ...(isSign ? {
        sign: this.getSignature(params),
        api_key: this.apiKey
      } : {})
    };
    const qstr = Utils.getQueryString(signedParams);
    let url = `${URL}/${this.version}/${endpoint}.do`;
    if (method === 'GET') url += `?${qstr}`;
    const cType = 'application/x-www-form-urlencoded';
    // console.log(signedParams, method, 'signedParams...');
    const o = {
      uri: url,
      proxy: this.proxy,
      method,
      headers: {
        'Content-Type': cType,
        'User-Agent': USER_AGENT,
      },
      form: signedParams
    };
    // console.log(o, 'o...');
    let body;
    try {
      // console.log('request...', o);
      body = await request(o);
    } catch (e) {
      if (e) console.log(e.message);
      return;
    }
    if (body && body.error_code) {
      throw error.getErrorFromCode(body.error_code);
    }
    return body.data || body;
  }
  // ws接口
  async wsTicks(o, cb) {
    let data = [];
    const cbf = _.throttle(() => {
      cb(data);
      data = [];
    }, 300);
    //
    let pairs = exchangePairs.okex;
    if (o.filter) pairs = _.filter(pairs, o.filter);
    const chanelString = kUtils.createWsChanelTick(pairs);
    const options = {
      proxy: this.proxy,
      willLink: ws => ws.send(chanelString)
    };
    subscribe('', (ds) => {
      ds = kUtils.formatWsTick(ds);
      data = data.concat(ds);
      cbf();
    }, options);
  }
  async wsBalance(o, cb) {
    let data = [];
    const cbf = _.throttle(() => {
      cb(data);
      data = [];
    }, 300);
    //
    let pairs = exchangePairs.okex;
    if (o.filter) pairs = _.filter(pairs, o.filter);
    const chanelString = kUtils.createWsChanelBalance(pairs);
    const options = {
      proxy: this.proxy,
      willLink: ws => ws.send(chanelString)
    };
    subscribe('', (ds) => {
      ds = kUtils.formatWsBalance(ds);
      data = data.concat(ds);
      cbf();
    }, options);
  }
}

module.exports = Exchange;

