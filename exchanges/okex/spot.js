// const Utils = require('./utils');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const _ = require('lodash');
const kUtils = require('./utils');
const Utils = require('./../../utils');
const md5 = require('md5');
const error = require('./errors');
const { exchangePairs } = require('./../data');
const { USER_AGENT, WS_BASE } = require('./config');
//
const { checkKey } = Utils;
//
const ALL_PAIRS = exchangePairs.okex;
function mergeArray(data, d) {
  return data.concat(data, d);
}

function merge(data, d) {
  return { ...data, ...d };
}
const URL = 'https://www.okex.com/api';
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.url = URL;
    this.version = 'v1';
    this.name = 'okex';
  }
  getSignature(params) {
    const qstr = `${Utils.getQueryString({ ...params, api_key: this.apiKey })}&secret_key=${this.apiSecret}`;
    return md5(qstr).toUpperCase();
  }
  async tick(o = {}) {
    checkKey(o, ['pair']);
    const ds = await this.get('ticker', o);
    return kUtils.formatTick(ds, o.pair);
  }
  async ticks(o = {}) {
    const ds = await this.tick(o);
    return ds;
  }
  async depth(o = {}) {
    const ds = await this.get('depth', o, false);
    return kUtils.formatDepth(ds);
  }
  async orderInfo(o = {}) {
    const { orderId: order_id } = o;
    const ds = await this.get('trades', { order_id }, true, true);
    return ds;
  }
  async activeOrders() {}
  async allOrders() { // 近2天来的order
    await this.post('order_history');
  }
  async cancelAllOrders(o) {
  }
  async cancelOrder(o = {}) {
    checkKey(o, ['orderId', 'pair']);
    o = kUtils.formatCancelOrderO(o);
    await this.post('cancel_order', o);
  }
  async orderBook(o = {}) {
    const ds = await this.get('trades', o, true, true);
    return kUtils.formatOrderBook(ds);
  }
  async balances() {
    const ds = await this.post('userinfo', {}, true);
    return kUtils.formatBalances(ds);
  }
  async order(o = {}) {
    o = kUtils.formatOrderO(o);
    let ds = await this.post('trade', o, true);
    ds = kUtils.formatOrderResult(ds);
    return ds;
  }
  async request(method = 'GET', endpoint, params = {}, isSign = false) {
    params = Utils.replace(params, { pair: 'symbol' });
    if (params.symbol) params.symbol = kUtils.formatPair(params.symbol);
    const signedParams = {
      ...params,
      ...(isSign ? {
        sign: this.getSignature(params),
        api_key: this.apiKey
      } : {})
    };
    const qstr = Utils.getQueryString(signedParams);
    let url = `${URL}/${this.version}/${endpoint}.do`;
    if (method === 'GET') url += `?${qstr}`;
    const cType = 'application/x-www-form-urlencoded';
    // console.log(signedParams, method, 'signedParams...');
    const o = {
      uri: url,
      proxy: this.proxy,
      method,
      headers: {
        'Content-Type': cType,
        'User-Agent': USER_AGENT,
      },
      form: signedParams
    };
    let body;
    try {
      body = await request(o);
    } catch (e) {
      if (e) console.log(e.message);
      return;
    }
    if (body && body.error_code) {
      throw error.getErrorFromCode(body.error_code);
    }
    return body.data || body;
  }
  _getPairs(filter) {
    let pairs = ALL_PAIRS;
    if (filter) pairs = _.filter(pairs, filter);
    return _.map(pairs, d => d.pair);
  }
  createWs(o = {}) {
    const { timeInterval, chanelString } = o;
    return (formatData, cb) => {
      let data = {};
      const cbf = _.throttle(() => {
        const res = _.values(data);
        if (res.length) {
          cb(res);
          data = {};
        }
      }, timeInterval);
      //
      const options = { proxy: this.proxy, willLink: ws => ws.send(chanelString) };
      kUtils.subscribe('', (ds) => {
        // console.log(formatData(ds), 'formatData(ds)');
        data = merge(data, formatData(ds));
        cbf();
      }, options);
    };
  }
  // ws接口
  async wsTicks(o, cb) {
    const pairs = this._getPairs(o.filter);
    const chanelString = kUtils.createSpotChanelTick(pairs);
    this.createWs({ chanelString }, 'pair')(kUtils.formatWsTick, cb);
  }
  async wsBalance(o, cb) {
    const pairs = this._getPairs(o.filter);
    const chanelString = kUtils.createSpotChanelBalance(pairs);
    this.createWs({ chanelString })(kUtils.formatWsBalance, cb);
  }
}

module.exports = Exchange;

