const Utils = require('./../utils');
// const bUtils = require('./../../utils');
const Event = require('bcore/event');
const _ = require('lodash');
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
  constructor(config = {}, options = {}) {
    super();
    const { apiKey, apiSecret, unique_id } = config;
    this.config = config;
    this.options = deepmerge(defaultOptions, options);
    this.apiSecret = apiSecret;
    this.apiKey = apiKey;
    this.unique_id = unique_id;
    this.proxy = isProxy ? 'http://127.0.0.1:1087' : null;
  }
  // 工具函数
  print(str, color = 'yellow') {
    str = `${this.name}: ${str}`;
    return Utils.print(str, color);
  }
  warn(str) {
    this.print(str, 'red');
  }
  warnExit(str) {
    this.warn(str);
    process.exit();
  }
  // CURD
  async get(endpoint, params, isSign) {
    return await this.request('GET', endpoint, params, isSign);
  }
  async post(endpoint, params, isSign) {
    return await this.request('POST', endpoint, params, isSign);
  }
  async delete(endpoint, params, isSign) {
    return await this.request('DELETE', endpoint, params, isSign);
  }
  // 保存配置
  _getConifgPath(file, ext = 'json') {
    return path.join(__dirname, `./${this.name}/meta/${file}.json`);
  }
  saveConfig(json = {}, file) {
    const { name } = this;
    const pth = this._getConifgPath(file);
    const str = JSON.stringify(json, null, 2);
    fs.writeFileSync(pth, str, 'utf8');
  }
  readConfig(file) {
    const pth = this._getConifgPath(file);
    const text = fs.readFileSync(pth, 'utf8');
    return JSON.parse(text);
  }
  // 别名 alias
  async candlestick(o) { // 与kline意义一致
    return await this.kline(o);
  }//
  _getWrapConfig(config = {}) {
    let defaultConfig;
    try {
      defaultConfig = this.readConfig('api');
    } catch (e) {
      this.warnExit('可能未配置wrap (exchange/meta/api.json)');
    }
    return { ...defaultConfig, ...config };
  }
  wrap(config = {}) {
    config = this._getWrapConfig(config);
    _.forEach(config, (conf, fnName) => {
      const fn = this[fnName];
      if (!fn) this.warnExit(`不存在函数${fnName}`, 'red');
      this[fnName] = Utils.wrapFn(fn, conf);
    });
    return true;
  }
}

module.exports = exchange;
