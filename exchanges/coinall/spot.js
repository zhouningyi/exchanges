// const Utils = require('./utils');
const deepmerge = require('deepmerge');
const crypto = require('crypto');
// const md5 = require('md5');
const _ = require('lodash');
const error = require('./errors');
const Base = require('./../base');
const kUtils = require('./utils');
const Utils = require('./../../utils');
const request = require('./../../utils/request');

// const { exchangePairs } = require('./../data');
const { USER_AGENT, WS_BASE } = require('./config');
const ALL_PAIRS = require('./meta/pairs.json');
//
const { checkKey } = Utils;
//

function merge(data, d) {
  return { ...data, ...d };
}

const URL = 'https://www.coinall.com/api';
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.url = URL;
    this.version = 'v3';
    this.name = 'coinall';
    this.init();
  }
  async init() {
    // const pairs = await this.pairs();
    // const pairO = _.keyBy(pairs, 'pair');
    // this.saveConfig(pairO, 'pairs');
  }
  getSignature(method, time, endpoint, params) {
    method = method.toUpperCase();
    const paramStr = method === 'GET' ? Utils.getQueryString(params) : JSON.stringify(params);
    const sign = method === 'GET' ? '?' : '';
    const totalStr = [`${time}${method}/api/${endpoint}`, paramStr].filter(d => d).join(sign);// paramStr
    return crypto.createHmac('sha256', this.apiSecret).update(totalStr).digest('base64');// .toString('base64');
  }
  async coins() {
    const ds = await this.get('account/v3/currencies', {}, false);
    return kUtils.formatCoin(ds);
  }
  async tick(o = {}) {
    const { pair } = o;
    let ds;
    if (pair) {
      ds = await this.get(`spot/v3/products/${pair}/ticker`, {});
    } else {
      ds = await this.get('spot/v3/products/ticker', {});
    }
    if (!Array.isArray(ds)) ds = [ds];
    return kUtils.formatTick(ds, o.pair);
  }
  async kline(o = {}) {
  }
  async depth(o = {}) {
  }
  // 交易状态
  async orderInfo(o = {}) {
    checkKey(o, ['order_id']);
    const { order_id, pair } = o;
    const opt = { product_id: pair };
    const info = await this.get(`spot/v3/orders/${order_id}`, opt);
    return kUtils.formatOrderInfo(info, opt);
  }
  async unfinishOrders(o = {}) {
    checkKey(o, ['pair']);
    const ds = await this.get('spot/v3/orders_pending');
    return kUtils.formatUnfinishOrder(ds);
  }
  async successOrders(o = {}) {
    checkKey(o, ['pair']);
  }
  async balances(o = {}) {
    const { pair } = o;
    if (!pair) {
      const ds = await this.get('spot/v3/accounts', {});
      return kUtils.formatBalance(ds);
    } else {
      let ds = await this.get(`spot/v3/accounts/${pair}`, {});
      if (!Array.isArray(ds)) ds = [ds];
      return kUtils.formatBalance(ds);
    }
  }
  async wallet(o = {}) {
    const { pair } = o;
    if (!pair) {
      const ds = await this.get('account/v3/wallet', {});
      return kUtils.formatWallet(ds);
    } else {
      const ds = await this.get(`account/v3/wallet/${pair}`, {});
      return kUtils.formatWallet(ds);
    }
  }
  // 交易
  async order(o = {}) {
    checkKey(o, ['pair', 'side', 'type', 'amount']);
    const opt = kUtils.formatOrderO(o);
    const ds = await this.post('spot/v3/orders', opt);
    const res = kUtils.formatOrder(ds, o, 'UNFINISH');
    return res;
  }
  async cancelOrder(o = {}) {
    checkKey(o, ['order_id', 'pair']);
    const { order_id, pair } = o;
    const ds = await this.delete(`spot/v3/orders/${order_id}`, { product_id: pair });
    return kUtils.formatOrder(ds, o, 'CANCEL');
  }
  async cancelAllOrders(o = {}) {
    checkKey(o, ['pair']);
    const { pair } = o;
    const ds = await this.delete('spot/v3/orders', { product_id: pair });
    const res = kUtils.formatOrder(ds, 'CANCEL');
    return res;
  }
  async request(method = 'GET', endpoint, params = {}, isSign = false) {
    params = Utils.cleanObjectNull(params);
    params = _.cloneDeep(params);
    const time = new Date().toISOString();
    const qstr = Utils.getQueryString(params);
    let url;
    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else {
      url = `${URL}/${endpoint}`;
    }
    if (method === 'GET' && qstr) url += `?${qstr}`;
    const o = {
      uri: url,
      proxy: this.proxy,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
        'OK-ACCESS-KEY': this.apiKey,
        'OK-ACCESS-SIGN': this.getSignature(method, time, endpoint, params),
        'OK-ACCESS-TIMESTAMP': `${time}`,
        'OK-ACCESS-PASSPHRASE': this.passphrase
      },
      ...(method === 'GET' ? {} : { body: JSON.stringify(params) })
    };
    let body;
    // console.log(o, '..9..');
    try {
      body = await request(o);
      // console.log(body, 'body...');
    } catch (e) {
      if (e) console.log(e.message);
      return false;
    }
    if (!body) {
      console.log(`${endpoint}: body 返回为空...`);
      return false;
    }
    if (body.code === 500) {
      console.log(`${endpoint}: 服务拒绝...`);
      return false;
    }
    if (body.code === -1) {
      console.log(`${endpoint}: ${body.msg}`);
      return false;
    }
    if (body.error_code) {
      console.log(`${error.getErrorFromCode(body.error_code)} | ${endpoint}`, endpoint, params);
      return false;
    }
    return body.data || body || false;
  }
  async pairs(o = {}) {
  }
  async moveBalance(o = {}) {
    checkKey(o, ['source', 'target', 'amount', 'coin']);
    const opt = kUtils.formatMoveBalanceO(o);
    const ds = await this.post('account/v3/transfer', opt, true);
    return ds;
  }
  //
  calcCost(o = {}) {
    checkKey(o, ['source', 'target', 'amount']);
    const { source, target, amount } = o;
    return 0.002 * amount;
  }
  // calcCostFuture(o = {}) {
  //   checkKey(o, ['coin', 'side', 'amount']);
  //   const { coin, amount, side = 'BUY' } = o;
  // }
}

module.exports = Exchange;

