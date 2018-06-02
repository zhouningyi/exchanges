// const Utils = require('./utils');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const HmacSHA256 = require('crypto-js/hmac-sha256');
const moment = require('moment');
const md5 = require('md5');
const _ = require('lodash');
const Utils = require('./../../utils');
const tUtils = require('./utils');
const WebSocket = require('ws');

const { checkKey } = Utils;
// /market
const REST_URL = 'api.huobipro.com';
const USER_AGENT = 'Mozilla/4.0 (compatible; Node Binance API)';
const CONTENT_TYPE = 'application/x-www-form-urlencoded';
const WS_BASE = 'wss://api.huobi.pro/ws';
//
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'
};

const subscribe = Utils.ws.genSubscribe(WS_BASE);

class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.name = 'huobi';
    this.version = 'v1';
    this.init();
  }
  getSignature(params) {
    params = _.cloneDeep(params);
    params.secret_key = this.apiSecret;
    const ordered = [];
    Object.keys(params).sort().forEach((key) => {
      ordered.push(`${key}=${ordered[key]}`);
    });
    return md5(ordered.join('&')).toLowerCase();
  }
  async init() {
    // const waitTime = 1000 * 60 * 5;
    // const pairs = await this.pairs();
    // tUtils.updatePairs(pairs);
    // await Utils.delay(waitTime);
    // await this.init();
  }
  testOrder(o) {
    return tUtils.testOrder(o);
  }
  async time() {
    return await this.get('time');
  }
  async kline(o = {}) {
    const defaultO = {
      size: 2000
    };
    checkKey(o, ['interval', 'pair']);
    o = { ...defaultO, ...o };
    const opt = tUtils.formatKlineO(o);
    const ds = await this.get('market/history/kline', opt, false);
    return tUtils.formatKline(ds, o);
  }
  async prices(o = {}) {
    const ds = await this.get('v3/ticker/price', o, false);
    return ds;
  }
  async ticks(o = {}) {
    const ds = await this.get('v3/ticker/bookTicker', o);
    return tUtils.formatTicks(ds);
  }
  async order(o) {
    const opt = tUtils.formatOrderO(o);
    if (!opt) return;
    const ds = await this.post('v3/order', opt, true, true);
    if (ds) {
      Utils.print(`${opt.side} - ${o.pair} - ${ds.executedQty}/${o.amount}`, 'red');
    }
    return ds;
  }
  async fastOrder(o) {
    checkKey(o, ['amount', 'side', 'pair']);
    const waitTime = 200;
    const ds = await this.order(o);
    if (!ds) return;
    if (ds.status === 'NEW') {
      await Utils.delay(waitTime);
      await this.cancelOrder({
        order_id: ds.order_id,
        pair: o.pair,
        side: o.side
      });
      return ds;
    }
    return ds;
  }
  async cancelOrder(o) {
    checkKey(o, ['order_id', 'side']);
    o = tUtils.formatCancelOrderO(o);
    const ds = await this.delete('v3/order', o, true, true);
    return ds;
  }
  async activeOrders(o = {}) {
    const ds = await this.get('v3/openOrders', o, true, true);
    return tUtils.formatActiveOrders(ds);
  }
  async pairs(o = {}) {
    const ds = await this.get('market', o);
    console.log(ds);
    // return tUtils.formatPairs(_.get(ds, 'symbols'));
  }
  async accounts() {
    const endpoint = '/v1/account/accounts';
    const ds = await this.get(endpoint, {}, true);
    return ds;
  }
  async balances(o = {}) {
    const defaultO = { type: 'spot' };
    o = { ...defaultO, ...o };
    const id = o.type === 'spot' ? this.spot_id : this.otc_id;
    const endpoint = `/v1/account/accounts/${id}/balance`;
    const ds = await this.get(endpoint, {}, true);
    return tUtils.formatBalance(ds);
  }
  // async orderBook(o = {}) {
  //   return await this.get('v3/allOrders', o, true, true);
  // }
  // async depth(o = {}) {
  //   o = { limit: 20, ...o };
  //   const ds = await this.get('v1/depth', o);
  //   return tUtils.formatDepth(ds);
  // }
  // async ping() {
  //   const ds = await this.get('v1/ping');
  //   return !!ds;
  // }
  // async balances(o = {}) {
  //   const ds = await this.get('v3/account', {}, true, true);
  //   return tUtils.formatBalances(_.get(ds, 'balances'), o);
  // }
  signSha(method, baseurl, path, data) {
    // console.log(method, baseurl, path, data, 'method, baseurl, path, data');
    const pars = [];
    for (const item in data) {
      pars.push(`${item}=${encodeURIComponent(data[item])}`);
    }
    let p = pars.sort().join('&');
    console.log(p);
    const meta = [method, baseurl, path, p].join('\n');
    const hash = HmacSHA256(meta, this.apiSecret);
    // const signatureStr = new Buffer(meta).toString('base64');
    const Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
    // const hash = crypto.createHmac('sha256', this.apiSecret).update(signatureStr).digest('hex');
    // const sig = new Buffer(hash).toString('base64');
    // const Signature = encodeURIComponent(hash);
    p += `&Signature=${Signature}`;
    return p;
  }
  _getBody() {
    return {
      AccessKeyId: this.apiKey,
      SignatureMethod: 'HmacSHA256',
      SignatureVersion: 2,
      Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
    };
  }


  async request(method = 'GET', endpoint, params = {}, isSign, isTimestamp) {
    const { options } = this;
    params = tUtils.formatPair(params);
    // params.AccessKeyId = this.apiKey;
    if (method === 'GET') {
    } else if (method === 'POST') {
    }
    let qstr = '';
    if (isSign) {
      const info = this._getBody();
      const payload = this.signSha(method, REST_URL, endpoint, info);
      qstr = payload; // [payload].join('&');// qstr,
    }
    const url = `https://${REST_URL}${endpoint}?${qstr}`;
    console.log(url, 'url');
    const o = {
      timeout: options.timeout,
      uri: url,
      proxy: this.proxy,
      method,
      headers: {
        ...DEFAULT_HEADERS,
        // ...(isSign ? {
        //   // AuthData: this.getAuth(),
        //   'User-Agent': USER_AGENT,
        //   'X-MBX-APIKEY': this.apiKey
        // } : {})
      },
    };
    //
    let body;
    try {
      // console.log('request', o);
      body = await request(o);
      // console.log(body, 'body...');
    } catch (e) {
      if (e) console.log('request...', e.message || e);
      return null;
    }
    const error = body['err-msg'];
    if (error) throw error;
    return body.data || body;
  }
  //
  wsTicks(o, cb) {
    const { proxy } = this;
    subscribe('!ticker@arr', (data = {}) => {
      data = data.data;
      if (!data) return console.log(`${'wsTicks'}数据为空....`);
      data = tUtils.formatTicksWS(data);
      cb(data);
    }, { proxy });
  }
}

module.exports = Exchange;
