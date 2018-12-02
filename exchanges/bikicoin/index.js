// const Utils = require('./utils');
const Base = require('./../base');
const request = require('./../../utils/request');
// const crypto = require('crypto');
const md5 = require('md5');
const _ = require('lodash');

const Utils = require('./../../utils');
const tUtils = require('./utils');

const ALL_PAIRS = require('./meta/pairs.json');

const { checkKey } = Utils;
//
const REST_URL = 'https://api.bikicoin.com';
const USER_AGENT = 'Mozilla/4.0 (compatible; Node Bikicoin API)';
const CONTENT_TYPE = 'application/x-www-form-urlencoded';
const PRIVATE_API = 'exchange-open-api/open/api';

class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.name = 'bikicoin';
    this.version = 'v1';
    this.init();
  }
  getSignature(qs) {
    const str = _.sortBy(_.map(qs, (v, k) => `${k}${v}`), d => d).join('') + this.apiSecret;
    return md5(str);
  }
  async init() {
    const pairs = await this.pairs();
    this.saveConfig(pairs, 'pairs');
  }
  async pairs(o = {}) {
    try {
      let ds = await this.get(`api/${this.version}/exchangeInfo`, o);
      if (!ds) return ALL_PAIRS;
      ds = tUtils.formatPairs(ds);
      return ds;
    } catch (e) {
      return ALL_PAIRS;
    }
  }
    // 市场
  async ticks(o = {}) {
    const ds = await this.get(`api/${this.version}/tickers`, o);
    return tUtils.formatTicks(ds, o);
  }
  async depth(o = {}) {
    const defaultO = { size: 5 };
    checkKey(o, 'pair');
    o = { ...defaultO, ...o };
    const opt = tUtils.formatDepthO(o);
    const ds = await this.get(`api/${this.version}/depth`, opt);
    return tUtils.formatDepth(ds, o);
  }
  async kline(o) {
    // checkKey(o, ['pair']);
    // const ds = await this.get('v1/klines', o, false);
    // return tUtils.formatKline(ds);
  }
  // 交易
  async order(o) {
    checkKey(o, ['pair', 'type', 'side']);
    const opt = tUtils.formatOrderO(o);
    const ds = await this.post(`${PRIVATE_API}/create_order`, opt, true);
    return tUtils.formatOrder(ds, o);
  }
  async orderInfo(o) {
    checkKey(o, ['pair', 'order_id']);
    const opt = tUtils.formatOrderInfoO(o);
    const ds = await this.get(`${PRIVATE_API}/order_info`, opt, true);
    return tUtils.formatOrderInfo(ds, o);
  }
  async balances(o = {}) {
    const ds = await this.get(`${PRIVATE_API}/user/account`, {}, true, true);
    return tUtils.formatBalances(ds, o);
  }
  async orders(o) {
    checkKey(o, ['pair']);
    const defaultO = { page: 1, pageSize: 60 };
    o = { ...defaultO, ...o };
    const opt = tUtils.formatOrdersO(o);
    const ds = await this.get(`${PRIVATE_API}/all_order`, opt, true) || {};
    return tUtils.formatOrders(ds, o);
  }
  async trades(o = {}) {
    checkKey(o, ['pair']);
    const defaultO = { page: 1, pageSize: 60 };
    o = { ...defaultO, ...o };
    const opt = tUtils.formatTradesO(o);
    // const ds = await this.get(`${PRIVATE_API}/all_trade`, opt, true) || {};
  }
  async cancelOrder(o) {
    checkKey(o, ['order_id', 'pair']);
    const opt = tUtils.formatCancelOrderO(o);
    const ds = await this.post(`${PRIVATE_API}/cancel_order`, opt, true);
    return tUtils.formatCancelOrder(ds, o);
  }
  async activeOrders(o = {}) {
    checkKey(o, ['pair']);
    const defaultO = { page: 0, pageSize: 100 };
    o = { ...defaultO, ...o };
    const opt = tUtils.formatActiveOrdersO(o);
    const ds = await this.get(`${PRIVATE_API}/new_order`, opt, true);
    return tUtils.formatActiveOrders(ds, o);
  }
  async cancelAllOrders(o = {}) {
    checkKey(o, ['pair']);
    const opt = tUtils.formatCancelAllOrdersO(o);
    const ds = await this.post(`${PRIVATE_API}/cancel_order_all`, opt, true, true);
    return tUtils.formatCancelAllOrders(ds, o);
  }
  async request(method = 'GET', endpoint, params = {}, signed, isTimestamp) {
    const { options } = this;
    params = tUtils.formatPair(params);
    const nonce = new Date().getTime();
    if (signed) {
      params = {
        api_key: this.apiKey,
        time: nonce,
        ...params
      };
      params.sign = this.getSignature(params);
    }
    // if (isTimestamp) params.timestamp = nonce;
    let base = `${REST_URL}/${endpoint}`;
    let url;
    if (method === 'GET') {
      const qstr = Utils.getQueryString(params, true);
      base = (qstr || signed) ? `${base}?` : base;
      url = `${base}${qstr}`;
    } else {
      url = base;
    }
    const o = {
      rejectUnauthorized: false,
      timeout: options.timeout,
      uri: url,
      proxy: this.proxy,
      method,
      headers: {
        'Content-Type': CONTENT_TYPE,
        ...(signed ? {
          'User-Agent': USER_AGENT,
        } : {})
      },
      ...(method === 'POST' ? { form: params } : {})
    };
    //
    let body;
    try {
      // console.log('request', o);
      body = await request(o);
      // if (url.indexOf('order') !== -1) {
      // console.log(body, 'body');
      // }
    } catch (e) {
      if (e) console.log('request error:', e, e.message || e);
      return null;
    }
    // console.log(endpoint, 'requested..');
    const { error, msg, code } = body;
    if (code && code !== '0') {
      Utils.print(msg, 'gray');
      // console.log(endpoint, params, body);
      throw msg;
    }
    if (error) throw error;
    return body.data || body;
  }

  //
  calcCost(o = {}) {
    checkKey(o, ['source', 'target', 'amount']);
    return o.amount * 0.0015;
  }
}

module.exports = Exchange;
