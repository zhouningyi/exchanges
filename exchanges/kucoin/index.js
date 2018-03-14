// const Utils = require('./utils');
const Base = require('./../base');
const querystring = require('querystring');
const request = require('request');
const crypto = require('crypto');
const _ = require('lodash');


const URL = 'https://api.kucoin.com';
class Exchange extends Base {
  constructor(options) {
    super(options);
    this.url = URL;
    this.version = 'v1';
  }
  async order() {
  }
  getSignature(path, queryString, nonce) {
    const strForSign = `/${path}/${nonce}/${queryString}`;
    const signatureStr = new Buffer(strForSign).toString('base64');
    const signatureResult = crypto.createHmac('sha256', this.apiSecret)
      .update(signatureStr)
      .digest('hex');
    return signatureResult;
  }
  async kline(params = {}) {
    const ds = await this.request('GET', 'open/kline', params);
    return ds;
  }
  async userInfo(){
    const ds = await this.get('user/info', {});
    return ds;
  }
  async ticks(){
    const ds = await this.get('open/tick', {});
    return ds;
  }
  async orders(o={}){
    const ds = await this.get('open/orders', o);
    const _map = d => ({
      price: d[0],
      amount: d[1],
      volume: d[2]
    });
    return {
      sell: _.map(ds.SELL, _map),//SELL
      buy: _.map(ds.BUY, _map),//BUY
    };
  }
  async get(endpoint, params){
    return await this.request('GET', endpoint, params);
  }
  async request(method='GET', endpoint, params = {}) {
    const signed = this.apiKey && this.apiSecret;
    const _path  = `${this.version}/${endpoint}`;
    const pth = `${this.url}/${_path}`;
    const nonce = new Date().getTime();
    const qstr = querystring.stringify(params);
    const url = `${pth}?${qstr}`;
    const o = {
      uri: url,
      proxy: this.proxy,
      method,
      // port: 443,
      headers: {
        'Content-Type': 'application/json',
        ...(signed ? {
          'KC-API-KEY': this.apiKey,
          'KC-API-NONCE': nonce,
          'KC-API-SIGNATURE': this.getSignature(_path, qstr, nonce)
        } : {})
      }
    };
    //
    return new Promise((resolve, reject) => {
      request(o, (e, res, body) => {
        if (e) return reject(e);
        if (typeof body === 'string') body = JSON.parse(body);
        if (!body.data) return reject(body.msg);
        resolve(body.data);
      });
    });
  }
}

module.exports = Exchange;
