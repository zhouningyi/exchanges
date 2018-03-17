// const Utils = require('./utils');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const _ = require('lodash');
const Utils = require('./../../utils');
//
const REST_URL = 'https://api.binance.com/api';
const USER_AGENT = 'Mozilla/4.0 (compatible; Node Binance API)';
const CONTENT_TYPE = 'application/x-www-form-urlencoded';
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.version = 'v1';
  }
  parsePair(params) {
    params = Utils.replace(params, { pair: 'symbol' });
    if (params.symbol) params.symbol = params.symbol.replace('-', '');
    return params;
  }
  getSignature(qs) {
    return crypto.createHmac('sha256', this.apiSecret).update(qs).digest('hex');
  }
  async kline(o) {
    return await this.get('klines', o, false);
  }
  async get(endpoint, params, signed) {
    return await this.request('GET', endpoint, params, signed);
  }
  async post(endpoint, params, signed) {
    return await this.request('POST', endpoint, params, signed);
  }

  async request(method = 'GET', endpoint, params = {}, signed) {
    const { options } = this;
    params = this.parsePair(params);
    // params = { recvWindow: options.timeout || params.timeout, ...params };
    const base = `${REST_URL}/${this.version}/${endpoint}`;
    const qstr = Utils.getQueryString(params, true);
    const url = signed ? `${base}?${qstr}&signature=${this.getSignature(qstr)}` : `${base}?${qstr}`;
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
    const body = await request(o);
    const { error, msg, code } = body;
    if (code && code < 0) throw msg;
    if (error) throw error;
    return body.data || body;
  }
}

module.exports = Exchange;
