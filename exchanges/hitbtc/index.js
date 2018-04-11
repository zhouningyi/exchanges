// const Utils = require('./utils');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const _ = require('lodash');
const kUtils = require('./utils');
const Utils = require('./../../utils');

const { checkKey } = Utils;
const uri = (path, params) => `${path}?${JSON.stringify(params)}`;

//
const CONTENT_TYPE = 'application/x-www-form-urlencoded';
const USER_AGENT = 'Mozilla/4.0 (compatible; Node HitBTC API)';
const REST_URL = 'https://api.hitbtc.com/api/';
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.url = REST_URL;
    this.version = '2';
    this.init();
  }
  async init() {
    this.pairs();
  }
  async coins(o = {}) {
    let ds = await this.get('public/currency', o);
    ds = kUtils.formatCoins(ds);
    return ds;
  }
  async pairs(o = {}) {
    let ds = await this.get('public/symbol', o);
    ds = kUtils.formatPairs(ds);
    return ds;
  }
  async ticks(o = {}) {
    let ds = await this.get('public/ticker', o);
    ds = kUtils.formatTickers(ds);
    console.log(ds, 'ds...');
    return ds;
  }
  //
  async balances(o = {}) {
  }
  getSignature(path, queryStr, nonce) {
    const message = {};
    return crypto
      .createHmac('sha512', this.apiSecret)
      .update(message)
      .digest('hex');
  }
  async request(method = 'GET', endpoint, params = {}, signed) {
    const { options } = this;
    const url = `${REST_URL}${this.version}/${endpoint}`;
    const o = {
      timeout: options.timeout,
      uri: url,
      proxy: this.proxy,
      method,
      headers: {
        // 'Content-Type': CONTENT_TYPE,
        ...(signed ? {
          'User-Agent': USER_AGENT,
          'X-Signature': this.getSignature()
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
  // 下订单
}

Exchange.options = {
  timeout: 10000
};

module.exports = Exchange;
