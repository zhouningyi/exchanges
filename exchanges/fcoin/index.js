// const Utils = require('./utils');
const url = require('url');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const moment = require('moment');
const md5 = require('md5');
const _ = require('lodash');
const Utils = require('./../../utils');
const tUtils = require('./utils');
const WebSocket = require('ws');


const { checkKey } = Utils;
// /market
const REST_URL = 'api.fcoin.com';
const USER_AGENT = 'Mozilla/4.0 (compatible; Node Binance API)';
const CONTENT_TYPE = 'application/x-www-form-urlencoded';
const WS_BASE = 'wss://api.fcoin.com/v2/ws';
//
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'
};

const subscribe = Utils.ws.genSubscribe(WS_BASE);

class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.name = 'fcoin';
    this.version = 'v2';
    this.init();
  }
  async init() {
    const pairs = await this.pairs();
    const ps = tUtils.getPairObject(pairs);
    this.saveConfig(ps, 'pairs');
  }
  async time() {
    const d = await this.get('public/server-time');
    return d ? { time: new Date(d) } : null;
  }
  async coins() {
    let ds = await this.get('public/currencies');
    ds = _.map(ds, d => ({
      coin: d.toUpperCase()
    }));
    return ds;
  }
  async pairs(o = {}) {
    const ds = await this.get('public/symbols', o);
    return tUtils.formatPairs(ds);
  }
  // market
  async tick(o = {}) {
    checkKey(o, ['pair']);
    const symbol = tUtils.pair2symbol(o.pair);
    const d = await this.get(`market/ticker/${symbol}`, o);
    return tUtils.formatTick(d, o);
  }
  // async kline(o = {}) {
  //   const defaultO = {
  //     size: 2000
  //   };
  //   checkKey(o, ['interval', 'pair']);
  //   o = { ...defaultO, ...o };
  //   const opt = tUtils.formatKlineO(o);
  //   const ds = await this.get('market/history/kline', opt, false);
  //   return tUtils.formatKline(ds, o);
  // }

  // 交易
  async order(o) {
    checkKey(o, ['side', 'type', 'amount']);
    const opt = tUtils.formatOrderO(o);
    let ds = await this.post('orders', opt, true, true);
    ds = tUtils.formatOrder(ds, o);
    return ds;
  }
  //
  async balances(o = {}) {
    const endpoint = 'accounts/balance';
    const ds = await this.get(endpoint, o, true);
    return tUtils.formatBalance(ds);
  }

  async cancelOrder(o) {
    checkKey(o, ['order_id']);
    o = tUtils.formatCancelOrderO(o);
    const ds = await this.post(`orders/${o.order_id}/submit-cancel`, o, true, true);
    if (ds && ds.status === 0) {
      return {
        order_id: o.order_id,
        status: 'CANCEL'
      };
    }
    return null;
  }
  async cancelAllOrders(o = {}) {
    checkKey(o, ['pair']);
    const os = await this.orders({
      pair: o.pair,
      status: 'UNFINISH'
    });
    const tasks = _.map(os, o => this.cancelOrder({ order_id: o.order_id }));
    await Promise.all(tasks);
  }
  async orders(o = {}) {
    checkKey(o, ['pair']);
    const opt = tUtils.formartOrdersO(o);
    const ds = await this.get('orders', opt, true, true);
    return tUtils.formartOrders(ds);
  }

  _getHeader(url, method = 'GET', o) {
    const t = Date.now();
    let str = `${method.toUpperCase()}${url}${t}`;
    if (method !== 'GET') {
      const ps = Utils.getQueryString(o);
      if (ps) str = `${str}${ps}`;
    }
    str = new Buffer(str).toString('base64');
    const signtmp = crypto.createHmac('sha1', this.apiSecret).update(str).digest().toString('base64');
    const headers = {
      'FC-ACCESS-KEY': this.apiKey,
      'FC-ACCESS-SIGNATURE': signtmp,
      'FC-ACCESS-TIMESTAMP': t,
    };
    if (method === 'POST') {
      headers['Content-Type'] = 'application/json;charset=UTF-8';
    }
    return headers;
  }

  async request(method = 'GET', endpoint, params = {}, isSign, isTimestamp) {
    const { options } = this;
    params = tUtils.formatPair(params);
    let url = `https://${REST_URL}/${this.version}/${endpoint}`;
    if (method === 'GET') {
      const qstr = Utils.getQueryString(params);
      if (qstr) url = `${url}?${qstr}`;
    } else if (method === 'POST') {
    }
    const headers = isSign ? this._getHeader(url, method, params) : {};
    const o = {
      timeout: options.timeout,
      uri: url,
      proxy: this.proxy,
      method,
      headers,
      ...(method === 'POST' ? { body: JSON.stringify(params) } : {})
    };
    // console.log(o);
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
    const error = body.msg;
    if (error) throw error;
    return body.data || body;
  }
  // 公用一个ws
  initWs(endpoint, sendMessage, filter, cb) {
    if (this.ws) return sendMessage(this.ws);
    this._isWsReady = false;
    const options = {};
    let ws;
    const reconnect = () => {
      this._isWsReady = false;
      this.initWs();
    };
    try {
      ws = new WebSocket(WS_BASE, options);
    } catch (e) {
      console.log(e);
      reconnect();
    }
    ws.tryPing = (noop) => {
      try {
        ws.ping(noop);
      } catch (e) {
        console.log(e, 'ping error');
      }
    };
    ws.on('open', () => {
      // console.log('open');
    });
    ws.on('pong', () => {
      // console.log('pong');
    });
    ws.on('ping', () => {
      // console.log('ping');
    });
    ws.on('message', (data) => {
      if (typeof data === 'string') data = JSON.parse(data);
      if (data.type === 'hello') { // 成功
        this._isWsReady = true;
        return sendMessage(ws);
      }
      if (filter(data)) cb(data);
    });
  }
  isWsReady() {
    return this._isWsReady;
  }
  // ws接口
  async wsTicks(o = {}, cb) {
    let pairs = o.pairs;
    if (!pairs) {
      pairs = await this.pairs();
      pairs = _.map(pairs, o => o.pair);
    }
    const args = _.map(pairs, (pair) => {
      const symbol = tUtils.pair2symbol(pair);
      return `ticker.${symbol}`;
    });
    const sendMessage = ws => ws.send(JSON.stringify({ cmd: 'sub', args, id: 'tick' }));
    const filter = d => d.ticker;
    const callback = (ds) => {
      const { ticker, type } = ds;
      const pair = tUtils.symbol2pair(type.split('.')[1]);
      const line = tUtils.formatTick(ticker, { pair });
      cb(line);
    };
    this.initWs('ticker', sendMessage, filter, callback);
  }
  //
  calcCost(o = {}) {
    checkKey(o, ['amount']);
    return 0.001 * o.amount;
  }
}

module.exports = Exchange;
