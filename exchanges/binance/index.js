// const Utils = require('./utils');
// const deepmerge = require('deepmerge');
const crypto = require('crypto');
const _ = require('lodash');
const error = require('./errors');
const Base = require('./../base');
const kUtils = require('./utils');
const Utils = require('./../../utils');
const request = require('./../../utils/request');
// const { exchangePairs } = require('./../data');
const { USER_AGENT, WS_BASE, SPOT_REST_BASE, USDT_CONTRACT_REST_BASE, COIN_CONTRACT_REST_BASE } = require('./config');
const apiConfig = require('./meta/api');
const future_pairs = require('./meta/future_pairs.json');
const swapUtils = require('./utils/swap');
const spotUtils = require('./utils/spot');
const futureUtils = require('./utils/future');
// const { patch } = require('request');

//
// const recvWindow = 5000;

function _parse(v) {
  return parseFloat(v, 10);
}

function klinePageFilter(d) {
  return d.close && d.open;
}
const { checkKey } = Utils;
//

// function mergeArray(data, d) {
//   return data.concat(data, d);
// }
const makeQueryString = q =>
Object.keys(q)
  .reduce((a, k) => {
    if (Array.isArray(q[k])) {
      q[k].forEach((v) => {
        a.push(`${k}=${encodeURIComponent(v)}`);
      });
    } else if (q[k] !== undefined) {
      a.push(`${k}=${encodeURIComponent(q[k])}`);
    }
    return a;
  }, [])
  .join('&');

class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.name = 'binance';
    this.options = { ...Exchange.options, ...options };
    this.init();
  }
  async init() {
    this.Utils = kUtils;
    this.loadFnFromConfig(apiConfig);
    this.initWs();
  }
  getSignature(method, endpoint, params, isws = false) {
    method = method.toUpperCase();
    const totalStr = makeQueryString(params);
    return crypto.createHmac('sha256', this.apiSecret).update(totalStr).digest('hex');// .toString('base64');
  }
  _getTime() {
    return new Date().toISOString();
  }
  getPairs(o = {}) {
    return o.pairs || future_pairs;
  }
  getUrlBase(o) {
    const { host = 'spot' } = o;
    if (host === 'spot') return SPOT_REST_BASE;
    if (host === 'usdt_contract') return USDT_CONTRACT_REST_BASE;
    if (host === 'coin_contract') return COIN_CONTRACT_REST_BASE;
  }
  //
  initWs(o = {}) {
    // if (!this.ws) {
    //   try {
    //     this.ws = kUtils.ws.genWs(WS_BASE, { proxy: this.proxy });
    //     this.loginWs();
    //   } catch (e) {
    //     console.log('initWs error');
    //     process.exit();
    //   }
    // }
    // this.wsFutureIndex = (o, cb) => this._addChanelV3('futureIndex', { pairs: this.getPairs(o) }, cb);
    // this.wsTicks = (o, cb) => this._addChanelV3('ticks', { pairs: this.getPairs(o) }, cb);
    // this.wsFutureDepth = (o, cb) => this._addChanelV3('futureDepth', { ...o, pairs: this.getPairs(o) }, cb);
    // this.wsFutureTicks = (o, cb) => this._addChanelV3('futureTicks', { pairs: this.getPairs(o), contract_type: o.contract_type }, cb);
    // this.wsFuturePosition = (o, cb) => this._addChanelV3('futurePosition', o, cb);
    // this.wsFutureBalance = (o, cb) => this._addChanelV3('futureBalance', o, cb);
    // this.wsFutureOrders = (o, cb) => this._addChanelV3('futureOrders', o, cb);
    // this.wsSpotOrders = (o, cb) => this._addChanelV3('spotOrders', o, cb);
    // this.wsSpotDepth = (o, cb) => this._addChanelV3('spotDepth', { pairs: this.getPairs(o) }, cb);
    // this.wsSpotBalance = (o, cb) => this._addChanelV3('spotBalance', o, cb);
    // this.wsSwapTicks = (o, cb) => this._addChanelV3('swapTicks', o, cb);
    // this.wsSwapDepth = (o, cb) => this._addChanelV3('swapDepth', o, cb);
    // this.wsSwapFundRate = (o, cb) => this._addChanelV3('swapFundRate', o, cb);
    // this.wsMarginBalance = (o, cb) => this._addChanelV3('marginBalance', o, cb);
    // this.wsSwapBalance = (o, cb) => this._addChanelV3('swapBalance', o, cb);
    // this.wsSwapPosition = (o, cb) => this._addChanelV3('swapPosition', o, cb);
    // this.wsSwapOrders = (o, cb) => this._addChanelV3('swapOrders', o, cb);
  }
  _addChanelV3(wsName, o = {}, cb) {
    const { ws } = this;
    const fns = kUtils.ws[wsName];
    if (fns.notNull) checkKey(o, fns.notNull);
    if (!ws || !ws.isReady()) return setTimeout(() => this._addChanelV3(wsName, o, cb), 100);
    if (fns.isSign && !this.isWsLogin) return setTimeout(() => this._addChanelV3(wsName, o, cb), 100);

    let chanel = fns.chanel(o);
    if (Array.isArray(chanel)) chanel = kUtils.ws.getChanelObject(chanel);
    //
    const validate = res => _.get(res, 'table') === fns.name;
    //
    ws.send(chanel);
    const callback = this.genWsDataCallBack(cb, fns.formater);
    ws.onData(validate, callback);
  }
  genWsDataCallBack(cb, formater) {
    return (ds) => {
      if (!ds) return [];
      const error_code = _.get(ds, 'error_code') || _.get(ds, '0.error_code') || _.get(ds, '0.data.error_code');
      if (error_code) {
        const str = `${ds.error_message || error.getErrorFromCode(error_code)} | [ws]`;
        throw new Error(str);
      }
      cb(formater(ds));
    };
  }
  loginWs() {
    if (!this.apiSecret) return;
    const t = `${Date.now() / 1000}`;
    const endpoint = 'users/self/verify';
    const sign = this.getSignature('GET', t, endpoint, {}, true);
    const chanel = { op: 'login', args: [this.apiKey, this.passphrase, t, sign] };
    const { ws } = this;
    if (!ws || !ws.isReady()) return setTimeout(() => this.loginWs(), 100);
    ws.send(chanel);
    ws.onLogin(() => {
      this.isWsLogin = true;
    });
  }
  _genHeader(method, endpoint, params, isSign) {
    const time = this._getTime();
    return {
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
      'X-MBX-APIKEY': this.apiKey
    };
  }
  async request(method = 'GET', endpoint, params = {}, isSign = false, host) {
    params = Utils.cleanObjectNull(params);
    params = _.cloneDeep(params);
    const hour8 = 3600 * 1000 * 8;
    params.timestamp = new Date().getTime();// + hour8;
    // params.recvWindow = this.options.recvWindow;
    const qstr = Utils.getQueryString(params);
    // if (!params.recvWindow) params.recvWindow = this.options.recvWindow;
    const REST_BASE = this.getUrlBase({ host });
    let url;
    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else {
      url = `${REST_BASE}/${endpoint}`;
    }
    if (method === 'GET' && qstr) url += `?${qstr}`;
    if (isSign) {
      const signature = this.getSignature(method, endpoint, params, false);
      const sigStr = `signature=${signature}`;
      params.signature = signature;
      if (url.indexOf('?') !== -1) {
        url += `&${sigStr}`;
      } else {
        url += `?${sigStr}`;
      }
    }
    const o = {
      uri: url,
      proxy: this.proxy,
      method,
      headers: this._genHeader(method, endpoint, params, isSign),
      ...(method === 'GET' ? { qs: params } : { body: JSON.stringify(params) })
    };

    let body;
    // try {
    body = await request(o);

    // } catch (e) {
    //   if (e) console.log(e.message);
    //   return false;
    // }
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
    if (body.error_code && body.error_code !== '0') {
      const msg = `${error.getErrorFromCode(body.error_code)}`;
      console.log(`${msg} | ${endpoint}`, endpoint, params);
      return { error: msg };
    }
    if (body.msg) {
      return {
        error: body.msg
      };
      // return Utils.throwError(body.error_message);
    }
    // if (url && url.indexOf('margin/v3/cancel_batch_orders') !== -1) {
    //   console.log(o, body.data || body || false, '0o2032');
    // }
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
}

Exchange.options = {
  recvWindow: 5000
};

module.exports = Exchange;

