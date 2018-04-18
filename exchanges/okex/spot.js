// const Utils = require('./utils');
const deepmerge = require('deepmerge');
const crypto = require('crypto');
const md5 = require('md5');
const _ = require('lodash');
const error = require('./errors');
const Base = require('./../base');
const kUtils = require('./utils');
const Utils = require('./../../utils');
const request = require('./../../utils/request');
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
    checkKey(o, 'pair');
    const ds = await this.get('ticker', o);
    return kUtils.formatTick(ds, o.pair);
  }
  async kline(o = {}) {
    checkKey(o, 'pair');
    const defaultKlineO = {
      interval: '1m',
      size: 2000
    };
    o = { ...defaultKlineO, ...o };
    const opt = kUtils.formatKlineO(o);
    const ds = await this.get('kline', opt);
    return kUtils.formatKline(ds, o);
  }
  async ticks(o = {}) {
    const ds = await this.tick(o);
    return ds;
  }
  async depth(o = {}) {
    const defaultO = {
      size: 50
    };
    const opt = { ...defaultO, ...o };
    const ds = await this.get('depth', opt, false);
    return kUtils.formatDepth(ds);
  }
  // 交易状态
  async orderInfo(o = {}) {
    checkKey(o, ['order_id', 'pair']);
    let { order_id, pair } = o;
    if (Array.isArray(order_id)) order_id = order_id.join(',');
    let ds = await this.post('orders_info', { order_id, pair }, true, true);
    ds = kUtils.formatOrderInfo(ds, o);
    return ds;
  }
  async activeOrders(o = {}) {
    checkKey(o, ['pair']);
    const ds = await this.allOrders({ ...o, status: 'UNFINISH' });
    return ds;
  }
  async finishOrders(o = {}) {
    checkKey(o, ['pair']);
    const ds = await this.allOrders({ ...o, status: 'SUCCESS' });
    return ds;
  }
  async allOrders(o = {}) { // 近2天来的order
    const defaultO = {
      page_length: 2000,
      current_page: 0,
      status: 'UNFINISH'
    };
    checkKey(o, ['pair']);
    o = { ...defaultO, ...o };
    const opt = kUtils.formatAllOrdersO(o);
    const ds = await this.post('order_history', opt, true);
    return kUtils.formatAllOrders(ds);
  }
  async balances(o = {}) {
    let ds = await this.post('userinfo', o, true);
    ds = kUtils.formatBalances(ds);
    return ds;
  }
  async allBalances() {
    const tasks = [this.balances(), this.futureBalances()];
    let [balances, futureBalances] = Promise.all(tasks);
    balances = _.keyBy(balances, 'coin');
    futureBalances = _.keyBy(futureBalances, 'coin');
  }
  // 交易
  async order(o = {}) {
    o = kUtils.formatOrderO(o);
    let ds = await this.post('trade', o, true);
    ds = kUtils.formatOrderResult(ds);
    return ds;
  }
  async cancelAllOrders(o = {}) {
    checkKey(o, ['pair']);
    const actives = await this.activeOrders({ pair: o.pair });
    const order_ids = _.map(actives, (d) => {
      return d.order_id;
    });
    const ds = await this.cancelOrder({
      pair: o.pair,
      order_id: order_ids
    });
    return ds;
  }
  async cancelOrder(o = {}) {
    checkKey(o, ['order_id', 'pair']);
    const { order_id } = o;
    if (Array.isArray(order_id) && order_id.length === 0) {
      return {
        success: [],
        error: []
      };
    }
    const opt = kUtils.formatCancelOrderO(o);
    const ds = await this.post('cancel_order', opt, true);
    return kUtils.formatCancelOrder(ds);
  }
  async orderBook(o = {}) {
    const ds = await this.get('trades', o, true, true);
    return kUtils.formatOrderBook(ds);
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
      // console.log(o, '===');
      body = await request(o);
      // console.log(body);
    } catch (e) {
      if (e) console.log(e.message);
      return;
    }
    // console.log(body, 'body...');
    if (!body) {
      throw `${endpoint}: body 返回为空`;
    }

    if (body.code === 500) {
      throw `${endpoint}: 服务拒绝...`;
    }
    if (body.code === -1) {
      throw `${endpoint}: ${body.msg}`;
    }
    if (body.error_code) {
      throw error.getErrorFromCode(body.error_code);
    }
    // console.log(body, 'body');
    return body.data || body;
  }
  _getPairs(filter, pairs) {
    if (pairs) return pairs;
    pairs = ALL_PAIRS;
    if (filter) pairs = _.filter(pairs, filter);
    return _.map(pairs, d => d.pair);
  }
  createWs(o = {}) {
    const { timeInterval, chanelString, options: opt } = o;
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
        data = merge(data, formatData(ds, opt));
        cbf();
      }, options);
    };
  }
  // ws接口
  wsTicks(o = {}, cb) {
    const pairs = this._getPairs(o.filter, o.pairs);
    const chanelString = kUtils.createSpotChanelTick(pairs);
    this.createWs({ chanelString }, 'pair')(kUtils.formatWsTick, cb);
  }
  wsBalance(o = {}, cb) {
    const pairs = this._getPairs(o.filter);
    const chanelString = kUtils.createSpotChanelBalance(pairs);
    this.createWs({ chanelString })(kUtils.formatWsBalance, cb);
  }
  wsDepth(o = {}, cb) {
    const defaultO = { size: 20 };
    o = { ...defaultO, ...o };
    const pairs = this._getPairs(o.filter, o.pairs);
    const chanelString = kUtils.createSpotChanelDepth(pairs, o);
    this.createWs({ chanelString })(kUtils.formatWsDepth, cb);
  }
}

module.exports = Exchange;

