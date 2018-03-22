// const Utils = require('./utils');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const _ = require('lodash');
const kUtils = require('./utils');
const Utils = require('./../../utils');
const md5 = require('md5');
const error = require('./errors');
//
const USER_AGENT = 'Mozilla/4.0 (compatible; Node OKEX API)';

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
  async depth(o = {}) {
    const ds = await this.get('depth', o, false);
    return kUtils.formatDepth(ds);
  }
  async orderInfo(o = {}) {
    const { orderId: order_id } = o;
    const ds = await this.get('trades', { order_id }, true, true);
    return ds;
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
    o = kUtils.formatOrder(o);
    let ds = await this.post('trade', o, true);
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
    const body = await request(o);
    console.log(body, 'body...');
    const { error_code } = body;
    if (error_code) {
      throw error.getErrorFromCode(error_code);
    }
    return body.data || body;
  }
  // 下订单
}

module.exports = Exchange;

