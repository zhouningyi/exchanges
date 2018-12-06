// const Utils = require('./utils');
// const deepmerge = require('deepmerge');
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
const okConfig = require('./meta/api');
const future_pairs = require('./meta/future_pairs.json');

//
const { checkKey } = Utils;
//

// function mergeArray(data, d) {
//   return data.concat(data, d);
// }

function merge(data, d) {
  return { ...data, ...d };
}

const URL = 'https://www.okex.com/api';
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.url = URL;
    this.version = 'v3';
    this.name = 'okex';
    this.init();
  }
  async init() {
    this.Utils = kUtils;
    this.loadFnFromConfig(okConfig);
    this.initWs();
  }
  getSignature(method, time, endpoint, params, isws = false) {
    method = method.toUpperCase();
    const paramStr = method === 'GET' ? Utils.getQueryString(params) : JSON.stringify(params);
    const sign = method === 'GET' ? '?' : '';
    const root = isws ? '' : 'api/';
    const totalStr = [`${time}${method}/${root}${endpoint}`, paramStr].filter(d => d).join(sign);// paramStr
    return crypto.createHmac('sha256', this.apiSecret).update(totalStr).digest('base64');// .toString('base64');
  }
  _getTime() {
    return new Date().toISOString();
  }
  _getLoginWsParams(params = {}) {
    const t = `${Date.now() / 1000}`;
    return {
      api_key: this.apiKey,
      sign: this.getSignature('GET', t, 'users/self/verify', params, true),
      timestamp: t,
      passphrase: this.passphrase
    };
  }
  getFuturePairs() {
    return future_pairs;
  }
  wsFutureIndex(o = {}, cb) {
    const pairs = o.pairs || this.getFuturePairs();
    const fns = kUtils.ws.futureIndex;
    this._addChanel({
      chanel: fns.channel({ pairs }),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }
  wsTicks(o = {}, cb) {
    const pairs = o.pairs || this.getFuturePairs();
    const fns = kUtils.ws.ticks;
    this._addChanel({
      chanel: fns.channel({ pairs }),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }
  wsFutureDepth(o = {}, cb) {
    const { pairs = this.getFuturePairs(), ...rest } = o;
    const fns = kUtils.ws.futureDepth;
    this._addChanel({
      chanel: fns.channel({ pairs, ...rest }),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }
  wsFutureTicks(o = {}, cb) {
    const pairs = o.pairs || this.getFuturePairs();
    const fns = kUtils.ws.futureTicks;
    this._addChanel({
      chanel: fns.channel({ pairs, contract_type: o.contract_type }),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }
  wsFuturePosition(o = {}, cb) {
    const fns = kUtils.ws.futurePosition;
    this._addChanel({
      chanel: this.getLoginChanelString(),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }
  wsFutureBalance(o = {}, cb) {
    const fns = kUtils.ws.futureBalance;
    this._addChanel({
      chanel: this.getLoginChanelString(),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }
  wsFutureOrders(o = {}, cb) {
    const fns = kUtils.ws.futureOrder;
    this._addChanel({
      chanel: this.getLoginChanelString(),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }
  wsOrders(o = {}, cb) {
    const fns = kUtils.ws.order;
    this._addChanel({
      chanel: this.getLoginChanelString(),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }
  wsDepth(o = {}, cb) {
    const fns = kUtils.ws.depth;
    const pairs = o.pairs || this.getFuturePairs();
    this._addChanel({
      chanel: fns.channel({ pairs }),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }
  wsBalance(o = {}, cb) {
    const fns = kUtils.ws.balance;
    this._addChanel({
      chanel: this.getLoginChanelString(),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }
  wsReqBalance(o = {}, cb) {
    const fns = kUtils.ws.reqBalance;
    this._addChanel({
      isSign: true,
      chanel: fns.channel(),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }
  wsReqOrders(o = {}, cb) {
    const fns = kUtils.ws.reqOrders;
    this._addChanel({
      isSign: true,
      chanel: fns.channel(o),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }

  wsSwapTicks(o = {}, cb) {
    const fns = kUtils.ws.swapTicks;
    this._addChanelV3({
      isSign: true,
      chanel: fns.channel(o),
      validate: fns.validate,
      formater: fns.formater,
      cb
    });
  }

  // loadWsFnFromConfig() {
  // }
  // loadWsFn(conf) {
  //   const { name } = conf;
  //   const fns = kUtils.ws.depth;
  //   return
  //   this._addChanel({
  //     chanel: fns.channel(),
  //     validate: fns.validate,
  //     formater: fns.formater,
  //     cb
  //   });
  // }
  initWs(o = {}) {
    if (!this.ws) {
      try {
        this.ws = kUtils.ws.genWs(WS_BASE, { proxy: this.proxy });
      } catch (e) {
        console.log('initWs error');
        process.exit();
      }
    }
  }
  _addChanelV3(o = {}) {
    const { ws } = this;
    if (!ws || !ws.isReady()) return setTimeout(() => this._addChanel(o), 100);
    const { chanel, validate, params = {}, formater, cb, isSign = false, interval } = o;
    if (isSign) this.addLoginInfo(chanel, params);
    ws.send(chanel);
    if (interval) {
      const f = this.intervalTask(() => ws.send(chanel), interval);
      f();
    }
    const callback = this.genWsDataCallBack(cb, formater, o);
    ws.onData(validate, callback);
  }
  _addChanel(o = {}) {
    const { ws } = this;
    if (!ws || !ws.isReady()) return setTimeout(() => this._addChanel(o), 100);
    const { chanel, validate, params = {}, formater, cb, isSign = false, interval } = o;
    if (isSign) this.addLoginInfo(chanel, params);
    ws.send(chanel);
    if (interval) {
      const f = this.intervalTask(() => ws.send(chanel), interval);
      f();
    }
    const callback = this.genWsDataCallBack(cb, formater, o);
    ws.onData(validate, callback);
  }
  genWsDataCallBack(cb, formater) {
    return (ds) => {
      const error_code = _.get(ds, 'error_code') || _.get(ds, '0.error_code') || _.get(ds, '0.data.error_code');
      if (error_code) {
        const str = `${ds.error_message || error.getErrorFromCode(error_code)} | [ws]`;
        throw new Error(str);
      }
      cb(formater(ds));
    };
  }
  addLoginInfo(line, params) {
    line.parameters = this._getLoginWsParams(params);
    return line;
  }
  getLoginChanelString(o = {}, cb) {
    return this.addLoginInfo({ event: 'login' }, {});
  }
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
  // async wsReqBalance(o = {}) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this._wsReqBalance(o, (balances) => {
  //         resolve(balances);
  //       });
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // }
  // _wsReqBalance(o = {}, cb) {
  //   // if (o.interval) this.intervalTask(this.updateWsBalance, o.interval)();
  //   const chanelString = { event: 'addChannel', channel: 'ok_spot_userinfo' }; // kUtils.createSpotChanelBalance(coins);, id: 'xxx'
  //   const validate = (ds) => {
  //     if (!ds) return false;
  //     const line = ds[0];
  //     if (!line || line.channel === 'addChannel') return;
  //     return line.channel === 'ok_spot_userinfo';
  //   };
  //   this.createWs({
  //     login: true,
  //     chanelString,
  //     name: 'wsReqBalance',
  //     validate,
  //     formater: kUtils.formatWsBalance,
  //     cb
  //   });
  // }
  //
  _genHeader(method, endpoint, params) {
    const time = this._getTime();
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
      headers: this._genHeader(method, endpoint, params),
      ...(method === 'GET' ? {} : { body: JSON.stringify(params) })
    };
    let body;
    // console.log(o, '..9..');
    try {
      body = await request(o);
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
      const msg = `${error.getErrorFromCode(body.error_code)}`;
      console.log(`${msg} | ${endpoint}`, endpoint, params);
      return Utils.throwError(msg);
    }
    if (body.error_message) {
      return Utils.throwError(body.error_message);
    }
    return body.data || body || false;
  }
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

