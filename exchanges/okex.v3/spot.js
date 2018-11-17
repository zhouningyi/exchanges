// const Utils = require('./utils');
// const deepmerge = require('deepmerge');
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
const okConfig = require('./meta/api');

//
const { checkKey } = Utils;
//

function mergeArray(data, d) {
  return data.concat(data, d);
}

function merge(data, d) {
  return { ...data, ...d };
}
// function _parse(t) {
//   return parseFloat(t, 10);
// }
const URL = 'https://www.okex.com/api';
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.url = URL;
    this.version = 'v3';
    this.name = 'okex';
    this.init();
  }
  getSignature(method, time, endpoint, params) {
    method = method.toUpperCase();
    const paramStr = method === 'GET' ? Utils.getQueryString(params) : JSON.stringify(params);
    const sign = method === 'GET' ? '?' : '';
    const totalStr = [`${time}${method}/api/${endpoint}`, paramStr].filter(d => d).join(sign);// paramStr
    return crypto.createHmac('sha256', this.apiSecret).update(totalStr).digest('base64');// .toString('base64');
  }
  async init() {
    this.Utils = kUtils;
    this.loadFnFromConfig(okConfig);
  }
  async time() {
    const ds = await this.get('general/v3/time');
    return { time: new Date(ds.iso) };
  }
  async tick(o = {}) {
    checkKey(o, 'pair');
  }
  async kline(o = {}) {
  }
  async ticks(o = {}) {
  }
  async depth(o = {}) {
  }
  // 交易状态
  async orderInfo(o = {}) {
  }
  async unfinishOrders(o = {}) {
  }
  async successOrders(o = {}) {
  }
  async allOrders(o = {}) { // 近2天来的order
  }
  async coins(o = {}) {
    const ds = await this.get('account/v3/currencies', {}, true);
    return kUtils.formatCoin(ds, o);
  }
  async wallet(o = {}) {
    const ds = await this.get('account/v3/wallet', {}, true);
    return kUtils.formatWallet(ds, o);
  }
  async balances(o = {}) {
    console.log(res, 'balances...');
    return res;
  }
  // async moveBalance(o = {}) {
  //   checkKey(o, ['source', 'target', 'amount', 'coin']);
  //   const opt = kUtils.formatMoveBalanceO(o);
  //   const ds = await this.post('account/v3/transfer', opt, true);
  //   return kUtils.formatMoveBalance(ds, o);
  // }
  async allBalances() {
  }
  // 交易
  async order(o = {}) {
  }
  async cancelAllOrders(o = {}) {
  }
  async cancelOrder(o = {}) {
  }
  async orderBook(o = {}) {
  }
  async unfinishedOrderInfo(o = {}) {
  }
  _genHeader(method, time, endpoint, params) {
    return {
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
      'OK-ACCESS-KEY': this.apiKey,
      'OK-ACCESS-SIGN': this.getSignature(method, time, endpoint, params),
      'OK-ACCESS-TIMESTAMP': `${time}`,
      'OK-ACCESS-PASSPHRASE': this.passphrase
    };
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
      headers: this._genHeader(method, time, endpoint, params),
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
      console.log(`${endpoint}: code 500, 服务拒绝...`);
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

