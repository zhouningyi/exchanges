// const Utils = require('./utils');
const Base = require('./../base');
const querystring = require('querystring');
const request = require('request');
const crypto = require('crypto');
const _ = require('lodash');

const {floor} = Math;
function _formatTime(o){
  return {
    ...o,
    from: o.from ? floor(o.from / 1000) : null,
    to: o.to ? floor(o.to / 1000) : null,
    // from : 1507479171 - 1000 * 60,
    // to: 1507479171
  };
}

const URL = 'https://api.kucoin.com';
class Exchange extends Base {
  constructor(options) {
    super(options);
    this.url = URL;
    this.version = 'v1';
  }
  getSignature(path, queryString, nonce) {
    const strForSign = `/${path}/${nonce}/${queryString}`;
    const signatureStr = new Buffer(strForSign).toString('base64');
    const signatureResult = crypto.createHmac('sha256', this.apiSecret)
      .update(signatureStr)
      .digest('hex');
    return signatureResult;
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
      headers: {
        'Content-Type': 'application/json',
        ...(signed ? {
          'KC-API-KEY': this.apiKey,
          'KC-API-NONCE': nonce,
          'KC-API-SIGNATURE': this.getSignature(_path, qstr, nonce)
        } : {})
      }
    };
    return new Promise((resolve, reject) => {
      request(o, (e, res, body) => {
        if (e) return reject(e);
        if (typeof body === 'string') body = JSON.parse(body);
        const { error } = body;//body.msg 
        if (body.code === 'Forbidden') return reject(body.msg);
        if (error) return reject(error);
        if (body.data) return resolve(body.data);
        resolve(body);
      });
    });
  }
  //
  async order(o={}) {
  }
  async coin(o={}){
    return this.get('market/open/coin-info', o);
  }
  async coins(o){
    return this.get('market/open/coins', o);
  }
  async kline(params = {}) {
    params = _formatTime(params);
    let ds = await this.get('open/chart/history', params);
    const {l, h, c, o, v, t} = ds;
    return _.map(ds.l, (d, i) => {
      return {
        low: l[i],
        high: h[i],
        close: c[i],
        open: o[i],
        volume: v[i],
        open_time: new Date(t[i] * 1000)
      };
    });
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
}

module.exports = Exchange;
