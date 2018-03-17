// const Utils = require('./utils');
const Base = require('./../base');
const request = require('request');
const crypto = require('crypto');
const _ = require('lodash');
const kUtils = require('./utils');
const Utils = require('./../../utils');
//
const URL = 'https://api.kucoin.com';
class Exchange extends Base {
  constructor(options) {
    super(options);
    this.url = URL;
    this.version = 'v1';
  }
  getSignature(path, queryStr, nonce) {
    const strForSign = `/${path}/${nonce}/${queryStr}`;
    const signatureStr = new Buffer(strForSign).toString('base64');
    const signatureResult = crypto.createHmac('sha256', this.apiSecret)
      .update(signatureStr)
      .digest('hex');
    return signatureResult;
  }
  async get(endpoint, params){
    return await this.request('GET', endpoint, params);
  }
  async post(endpoint, params, data){
    return await this.request('POST', endpoint, params);
  }
  _getQueryString(params){
    params = _.map(params, (value, key) => ({ value, key }));
    params = _.sortBy(params, (d) => d.key);
    return _.map(params, ({value, key}) => `${key}=${value}`).join('&');
  }
  async request(method='GET', endpoint, params = {}, data) {
    params = Utils.replace(params, { pair: 'symbol' });
    const signed = this.apiKey && this.apiSecret;
    const _path  = `${this.version}/${endpoint}`;
    const pth = `${this.url}/${_path}`;
    const nonce = new Date().getTime();
    const qstr = this._getQueryString(params);
    const url = `${pth}?${qstr}`;
    const formType = 'application/x-www-form-urlencoded';
    const jsonType = 'application/json';
    const cType = method === 'GET' ? formType : formType;
    const o = {
      uri: url,
      proxy: this.proxy,
      method,
      headers: {
        'Content-Type': cType,
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
        const { error } = body;
        if (body.code === 'Forbidden') return reject(body.msg);
        if (body.code === 'ERROR') return reject(body.msg);
        if (error) return reject(error);
        if (body.data) return resolve(body.data);
        resolve(body);
      });
    });
  }
  //下订单
  async order(o={}) {
    o.type = o.type.toUpperCase();
    return await this.post(`order`, o);
  }
  async activeOrders(o={}) {
    return await this.get(`order/active`, o);
  }
  async orderInfo(o){
    o = Utils.replace(o, {'orderid': 'orderOid'});
    return await this.get(`order/detail`, o);
  }
  async balances(o={}){
    const defaultO = {
      limit: 20//最多是20个
    };
    let ds = await this.get('account/balances', {...defaultO, ...o});
    ds = kUtils.getFilteredBalances(ds.datas);
    return ds;
  }
  async coin(o={}){
    return await this.get('market/open/coin-info', o);
  }
  async coins(o){
    return await this.get('market/open/coins', o);
  }
  async currencies(o){
    return await this.get('open/currencies', o);
  }
  async kline(params = {}) {
    params = kUtils.formatTime(params);
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
  async prices (){
    const ds = await this.get('market/open/symbols', {});
    return kUtils.formatPrices(ds);
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
