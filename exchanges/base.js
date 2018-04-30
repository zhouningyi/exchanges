// const Utils = require('./utils');
const Event = require('bcore/event');
// const config = require('./../config');
const deepmerge = require('deepmerge');
const argv = require('optimist').argv;
const fs = require('fs');
const path = require('path');

const defaultOptions = {
  timeout: 10000,
};

const isProxy = !!argv.proxy;

class exchange extends Event {
  constructor(o = {}, options = {}) {
    const { apiKey, apiSecret, unique_id } = o;
    super();
    this.options = deepmerge(defaultOptions, options);
    this.apiSecret = apiSecret;
    this.apiKey = apiKey;
    this.unique_id = unique_id;
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
  saveConfig(json = {}, file) {
    const { name } = this;
    const pth = path.join(__dirname, `./${name}/meta/${file}.json`);
    const str = JSON.stringify(json, null, 2);
    fs.writeFileSync(pth, str, 'utf8');
  }
}

module.exports = exchange;
