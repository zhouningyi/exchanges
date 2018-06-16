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
    this.init();
  }
  getSignature(params) {
    const qstr = `${Utils.getQueryString({ ...params, api_key: this.apiKey })}&secret_key=${this.apiSecret}`;
    return md5(qstr).toUpperCase();
  }
  init() {
    // saveConfig;
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
    checkKey(o, ['order_id', 'pair', 'type']);
    let { order_id, pair, type } = o;
    type = {
      UNFINISH: 0,
      FINISH: 1
    }[type];
    if (Array.isArray(order_id)) order_id = order_id.join(',');
    let ds = await this.post('orders_info', { order_id, pair, type }, true);
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
    const ds = await this.post('userinfo', o, true);
    return kUtils.formatBalances(ds);
  }
  async allBalances() {
    const tasks = [this.balances(), this.futureBalances()];
    let [balances, futureBalances] = Promise.all(tasks);
    balances = _.keyBy(balances, 'coin');
    futureBalances = _.keyBy(futureBalances, 'coin');
  }
  // 交易
  async order(o = {}) {
    const opt = kUtils.formatOrderO(o);
    let ds = await this.post('trade', opt, true);
    ds = kUtils.formatOrderResult(ds, o);
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
  async unfinishedOrderInfo(o = {}) {
    checkKey(o, ['pair']);
    o = { ...o, order_id: -1 };
    const ds = await this.post('order_info', o, true, true);
    return kUtils.formatOrderInfo(ds, o);
  }
  async request(method = 'GET', endpoint, params = {}, isSign = false) {
    params = _.cloneDeep(params);
    if (!params.symbol) {
      params = Utils.replace(params, { pair: 'symbol' });
      if (params.symbol) params.symbol = kUtils.pair2symbol(params.symbol);
    }
    delete params.pair;
    const signedParams = {
      ...params,
      ...(isSign ? {
        sign: this.getSignature(params),
        api_key: this.apiKey
      } : {})
    };
    const qstr = Utils.getQueryString(signedParams);
    let url;
    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else {
      url = `${URL}/${this.version}/${endpoint}.do`;
    }
    if (method === 'GET' && qstr) url += `?${qstr}`;
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
    // if (url.indexOf('trade') !== -1) console.log(o, 'o....');
    try {
      // console.log(o, '===');
      body = await request(o);
      // console.log(body);
    } catch (e) {
      if (e) console.log(e.message);
      return;
    }
    if (!body) {
      throw `${endpoint}: body 返回为空...`;
    }
    if (body.code === 500) {
      throw `${endpoint}: 服务拒绝...`;
    }
    if (body.code === -1) {
      throw `${endpoint}: ${body.msg}`;
    }
    if (body.error_code) {
      // if (body.error_code === 20015) {
      //   return {
      //     order_id: params.order_id,
      //     success: true,
      //     status: 'FINISHED'
      //   };
      // } else {
      console.log('error...', endpoint, params);
      throw (`${error.getErrorFromCode(body.error_code)} | ${endpoint}`);
      // }
    }
    return body.data || body || false;
  }
  async pairs(o = {}) {
    const url = 'https://www.okex.com/v2/spot/markets/products';
    let ds = await this.get(url);
    ds = kUtils.pair2symbol(ds);
    return ds;
  }
  _getPairs(filter, pairs) {
    if (pairs) return pairs;
    pairs = ALL_PAIRS;
    if (filter) pairs = _.filter(pairs, filter);
    return _.map(pairs, d => d.pair);
  }
  createWs(o = {}, isSign = false) {
    let { timeInterval, chanelString, options: opt, name } = o;
    if (isSign) {
      const parameters = { api_key: this.apiKey, sign: this.getSignature({}) };
      chanelString = _.map(chanelString, (c) => {
        c.parameters = parameters;
        return c;
      });
    }
    chanelString = chanelString && typeof chanelString === 'object' ? JSON.stringify(chanelString) : chanelString;
    return (formatData, cb, reconnect) => {
      let data = {};
      const cbf = _.throttle(() => {
        const res = _.values(data);
        if (res.length) {
          cb(res);
          data = {};
        }
      }, timeInterval);
      //
      const options = { proxy: this.proxy, willLink: ws => ws.send(chanelString), reconnect };
      kUtils.subscribe('', (ds) => {
        if (ds && ds.error_code) {
          const str = `${error.getErrorFromCode(ds.error_code)} | [ws] ${name}`;
          throw new Error(str);
        }
        data = merge(data, formatData(ds, opt || {}));
        cbf();
      }, options);
    };
  }
  // ws接口
  wsTicks(o = {}, cb) {
    const pairs = this._getPairs(o.filter, o.pairs);
    const chanelString = kUtils.createSpotChanelTick(pairs);
    const reconnect = () => this.wsTicks(o, cb);
    this.createWs({ chanelString, name: 'wsTicks' })(kUtils.formatWsTick, cb, reconnect);
  }
  wsBalance(o = {}, cb) {
    const pairs = this._getPairs(o.filter);
    const chanelString = kUtils.createSpotChanelBalance(pairs);
    const reconnect = () => this.wsBalance(o, cb);
    this.createWs({ chanelString, name: 'wsBalance' })(kUtils.formatWsBalance, cb, reconnect);
  }
  wsDepth(o = {}, cb) {
    const defaultO = { size: 20 };
    o = { ...defaultO, ...o };
    const pairs = this._getPairs(o.filter, o.pairs);
    const chanelString = kUtils.createSpotChanelDepth(pairs, o);
    const reconnect = () => this.wsDepth(o, cb);
    this.createWs({ chanelString, name: 'wsDepth' })(kUtils.formatWsDepth, cb, reconnect);
  }
}

module.exports = Exchange;

