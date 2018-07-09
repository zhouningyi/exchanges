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
// const { exchangePairs } = require('./../data');
const { USER_AGENT, WS_BASE } = require('./config');
const ALL_PAIRS = require('./meta/pairs.json');
//
const { checkKey } = Utils;
//


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
  async init() {
    // saveConfig;
    const pairs = await this.pairs();
    const pairO = _.keyBy(pairs, 'pair');
    this.saveConfig(pairO, 'pairs');
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
    let { order_id, pair, type } = o;
    let ds;
    if (Array.isArray(order_id)) {
      checkKey(o, ['type']);
      type = {
        UNFINISH: 0,
        FINISH: 1
      }[type];
      order_id = order_id.join(',');
      ds = await this.post('orders_info', { order_id, pair, type }, true);
    } else {
      ds = await this.post('order_info', { order_id, pair }, true);
    }
    ds = kUtils.formatOrderInfo(ds, o);
    return ds;
  }
  async unfinishOrders(o = {}) {
    checkKey(o, ['pair']);
    const ds = await this.allOrders({ ...o, status: 'UNFINISH' });
    return ds;
  }
  async successOrders(o = {}) {
    checkKey(o, ['pair']);
    const ds = await this.allOrders({ ...o, status: 'SUCCESS' });
    return ds;
  }
  async allOrders(o = {}) { // 近2天来的order
    const defaultO = {
      page_length: 1000,
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
    return { balances, futureBalances };
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
    if (Array.isArray(order_id) && order_id.length === 0) return [];
    const opt = kUtils.formatCancelOrderO(o);
    const ds = await this.post('cancel_order', opt, true);
    return kUtils.formatCancelOrder(ds, o);
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
    params = Utils.cleanObjectNull(params);
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
    try {
      const url = 'https://www.okex.com/v2/spot/markets/products';
      let ds = await this.get(url);
      if (ds.code === '404') return ALL_PAIRS;
      ds = kUtils.formatPairs(ds);
      return ds;
    } catch (e) {
      return ALL_PAIRS;
    }
  }
  _getPairs(filter, pairs) {
    if (pairs) return pairs;
    pairs = ALL_PAIRS;
    if (filter) pairs = _.filter(pairs, filter);
    return _.map(pairs, d => d.pair);
  }
  _getCoins(filter) {
    const pairs = this._getPairs(filter);
    const coins = {};
    _.forEach(pairs, (pair) => {
      const [left, right] = pair.split('-');
      coins[left] = true;
      coins[right] = true;
    });
    return _.keys(coins);
  }
  createWs(o = {}) {
    let { chanelString, validate, formater, cb, login = false, interval } = o;
    if (!this.ws) this.ws = Utils.ws.genWs(WS_BASE, { proxy: this.proxy });
    const { ws } = this;
    if (!ws.isReady()) return setTimeout(() => this.createWs(o, cb), 20);
    chanelString = chanelString && typeof chanelString === 'object' ? JSON.stringify(chanelString) : chanelString;
    if (login) {
      chanelString = JSON.parse(chanelString);
      chanelString.parameters = this._getLoginWsParams({});
      chanelString = JSON.stringify(chanelString);
    }
    ws.send(chanelString);
    if (interval) {
      (this.intervalTask(() => {
        ws.send(chanelString);
      }, interval))();
    }
    const callback = this.genWsDataCallBack(cb, formater, o);
    ws.onData(validate, callback);
  }
  genWsDataCallBack(cb, formater) {
    const timeInterval = 50;
    let data = {};
    const cbf = _.throttle(() => {
      const res = _.values(data);
      if (res.length) {
        cb(res);
        data = {};
      }
    }, timeInterval);
    return (ds) => {
      if (ds && ds.error_code) {
        const str = `${error.getErrorFromCode(ds.error_code)} | [ws] ${name}`;
        throw new Error(str);
      }
      // if (ds[0] && ds[0].channel.indexOf('ticker') === -1) console.log('\n\n\n', ds, '\n\n\n');
      ds = formater(ds);
      data = merge(data, ds);// opt ||
      cbf();
    };
  }
  // ws接口
  wsTicks(o = {}, cb) {
    const pairs = this._getPairs(o.filter, o.pairs);
    const validate = (ds) => {
      if (!ds) return false;
      const line = ds[0];
      if (!line || line.channel === 'addChannel') return;
      return line.channel.startsWith('ok_sub_spot_') && line.channel.endsWith('_ticker');
    };
    this.createWs({
      chanelString: kUtils.createSpotChanelTick(pairs),
      name: 'wsTicks',
      validate,
      formater: kUtils.formatWsTick,
      interval: o.interval,
      cb
    });
  }
  wsTicks1(o = {}, cb) {
    const pairs = this._getPairs(o.filter, o.pairs);
    const validate = (ds) => {
      if (!ds) return false;
      const line = ds[0];
      if (!line || line.channel === 'addChannel') return;
      return line.channel.startsWith('ok_sub_spot_') && line.channel.endsWith('_ticker');
    };
    const channelString =

    pairs.map((pair) => {
      return {
        event: 'addChannel',
        parameters: {
          binary: '1',
          type: 'all_ticker_3s'
        }
      };
    });
    this.createWs({
      chanelString: kUtils.createSpotChanelTick(pairs),
      name: 'wsTicks',
      validate,
      formater: kUtils.formatWsTick,
      interval: o.interval,
      cb
    });
  }
  _getLoginWsParams(params = {}) {
    return {
      api_key: this.apiKey,
      sign: this.getSignature(params)
    };
  }
  getLoginChanelString(o = {}, cb) {
    return {
      event: 'login',
      parameters: this._getLoginWsParams({})
    };
  }
  wsDepth(o = {}, cb) {
    const defaultO = { size: 5 };
    o = { ...defaultO, ...o };
    const pairs = this._getPairs(o.filter, o.pairs);
    const validate = (ds) => {
      if (!ds) return false;
      const line = ds[0];
      if (!line || line.channel === 'addChannel') return;
      return line.channel.startsWith('ok_sub_spot_') && line.channel.search('_depth_') !== -1;
    };
    this.createWs({
      chanelString: kUtils.createSpotChanelDepth(pairs, o),
      name: 'wsDepth',
      validate,
      formater: kUtils.formatWsDepth,
      cb
    });
  }
  wsBalance(o = {}, cb) {
    this._wsReqBalance(o, cb);
    const validate = (ds) => {
      if (!ds) return false;
      const line = ds[0];
      if (!line || line.channel === 'addChannel') return;
      const { channel } = line;
      return channel.startsWith('ok_sub_spot_') && channel.endsWith('_balance');
    };

    this.createWs({
      login: true,
      chanelString: this.getLoginChanelString(),
      name: 'wsBalance',
      validate,
      formater: kUtils.formatWsBalance,
      cb
    });
  }
  wsOrder(o = {}, cb) {
    const validate = (ds) => {
      if (!ds) return false;
      const line = ds[0];
      if (!line || line.channel === 'addChannel') return;
      const { channel } = line;
      return channel.startsWith('ok_sub_spot_') && channel.endsWith('_order');
    };

    this.createWs({
      login: true,
      chanelString: this.getLoginChanelString(),
      name: 'wsOrder',
      validate,
      formater: kUtils.formatWsOrder,
      cb
    });
  }
  // async wsReqOrders(o) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this._wsReqOrders(o, resolve);
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // }
  // _wsReqOrders(o = {}, cb) {
  //   checkKey(o, ['pair']);
  //   const symbol = o.pair.replace('-USDT', 'usd').toLowerCase();
  //   const chanelString = [{ event: 'addChannel', channel: 'ok_btcusd_trades' }];
  //   const validate = (ds) => {
  //     if (!ds) return false;
  //     const line = ds[0];
  //     if (!line || line.channel === 'addChannel') return;
  //     const { channel } = line;
  //     return channel === 'ok_btcusd_trades';
  //   };
  //   this.createWs({
  //     login: true,
  //     chanelString,
  //     name: 'wsReqOrders',
  //     validate,
  //     formater: kUtils.formatWsOrder,
  //     cb
  //   });
  // }
  // 主动请求balance信息
  async wsReqBalance(o = {}) {
    return new Promise((resolve, reject) => {
      try {
        this._wsReqBalance(o, (balances) => {
          resolve(balances);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  _wsReqBalance(o = {}, cb) {
    // if (o.interval) this.intervalTask(this.updateWsBalance, o.interval)();
    const chanelString = { event: 'addChannel', channel: 'ok_spot_userinfo' }; // kUtils.createSpotChanelBalance(coins);, id: 'xxx'
    const validate = (ds) => {
      if (!ds) return false;
      const line = ds[0];
      if (!line || line.channel === 'addChannel') return;
      return line.channel === 'ok_spot_userinfo';
    };
    this.createWs({
      login: true,
      chanelString,
      name: 'wsReqBalance',
      validate,
      formater: kUtils.formatWsBalance,
      cb
    });
  }
  //
  calcCost(o = {}) {
    checkKey(o, ['source', 'target', 'amount']);
    let { source, target, amount } = o;
    const outs = { BTC: true, ETH: true, USDT: true };
    source = source.toUpperCase();
    target = target.toUpperCase();
    if ((source === 'OKB' && !(target in outs)) || (target === 'OKB' && !(source in outs))) return 0;
    return 0.002 * amount;
  }
  // calcCostFuture(o = {}) {
  //   checkKey(o, ['coin', 'side', 'amount']);
  //   const { coin, amount, side = 'BUY' } = o;
  // }
}

module.exports = Exchange;

