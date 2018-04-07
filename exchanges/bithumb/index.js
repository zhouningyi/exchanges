// const Utils = require('./utils');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const _ = require('lodash');
const kUtils = require('./utils');
const Utils = require('./../../utils');

const { checkKey } = Utils;
//
const URL = 'https://api.bithumb.com';
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.url = URL;
  }

  getSignature(path, queryStr, nonce) {
    const strForSign = `/${path}/${nonce}/${queryStr}`;
    const signatureStr = new Buffer(strForSign).toString('base64');
    const signatureResult = crypto.createHmac('sha256', this.apiSecret)
      .update(signatureStr)
      .digest('hex');
    return signatureResult;
  }
  async ticks(o) {
    const { coin = 'ALL' } = o;
    const ds = await this.get(`public/ticker/${coin}`, {});
    return kUtils.formatTick(ds);
  }
  // 下订单
  async request(method = 'GET', endpoint, params = {}, data) {
    params = Utils.replace(params, { pair: 'symbol' });
    const signed = this.apiKey && this.apiSecret;
    const _path = `${this.version}/${endpoint}`;
    const pth = `${this.url}/${_path}`;
    const nonce = new Date().getTime();
    const qstr = Utils.getQueryString(params);
    const url = qstr ? `${pth}?${qstr}` : pth;
    const cType = 'application/x-www-form-urlencoded';
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
    try {
      // console.log(o);
      const body = await request(o);
      // if (url.indexOf('order') !== -1) {
      //   console.log(body);
      // }
      const { error, msg, code } = body;
      if (code !== 'OK') {
        console.log(msg);
        throw msg;
      }
      if (error) throw error;
      return body.data || body;
    } catch (e) {
      if (e && e.message)console.log(e.message);
      return null;
    }
  }
}

module.exports = Exchange;
