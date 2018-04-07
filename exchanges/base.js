// const Utils = require('./utils');
const Event = require('bcore/event');
// const config = require('./../config');
const deepmerge = require('deepmerge');
const argv = require('optimist').argv;


const defaultOptions = {
  timeout: 10000,
};
const isProxy = !!argv.proxy;

class exchange extends Event {
  constructor({ apiKey, apiSecret }, options = {}) {
    super();
    this.options = deepmerge(defaultOptions, options);
    this.apiSecret = apiSecret;
    this.apiKey = apiKey;
    this.proxy = isProxy ? 'http://127.0.0.1:1087' : null;
  }
  async candlestick(o) { // 与kline意义一致
    return await this.kline(o);
  }
  async get(endpoint, params, isSign) {
    return await this.request('GET', endpoint, params, isSign);
  }
  async post(endpoint, params, isSign) {
    return await this.request('POST', endpoint, params, isSign);
  }
  async delete(endpoint, params, isSign) {
    return await this.request('DELETE', endpoint, params, isSign);
  }
}

module.exports = exchange;
