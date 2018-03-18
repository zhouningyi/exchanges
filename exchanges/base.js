// const Utils = require('./utils');
const Event = require('bcore/event');
const config = require('./../config');
const deepmerge = require('deepmerge');

const defaultOptions = {
  timeout: 5000,
};

class exchange extends Event {
  constructor({ apiKey, apiSecret }, options = {}) {
    super();
    this.options = deepmerge(defaultOptions, options);
    this.apiSecret = apiSecret;
    this.apiKey = apiKey;
    this.proxy = config.proxy ? 'http://127.0.0.1:1087' : null;
  }
  async candlestick(o) { // 与kline意义一致
    return await this.kline(o);
  }
  async get(endpoint, params) {
    return await this.request('GET', endpoint, params, this.apiKey && this.apiSecret);
  }
  async post(endpoint, params) {
    return await this.request('POST', endpoint, params, this.apiKey && this.apiSecret);
  }
}

module.exports = exchange;
