// const Utils = require('./utils');
// const deepmerge = require('deepmerge');
const crypto = require('crypto');
const _ = require('lodash');
const Base = require('./../base');
const kUtils = require('./utils');
const Utils = require('./../../utils');
const request = require('./../../utils/request');
const WS = require('./utils/_ws');
// const { exchangePairs } = require('./../data');
const { USER_AGENT, WS_BASE } = require('./config');
const apiConfig = require('./meta/api');
// const future_pairs = require('./meta/future_pairs.json');

const { checkKey } = Utils;
//

const URL = 'https://api.kraken.com';
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.url = URL;
    this.name = 'kraken';
    this.init();
  }
  async init() {
    this.Utils = kUtils;
    this.loadFnFromConfig(apiConfig);
    this.initWs()
    await Promise.all([this.updatePairs()]);
  }
  initWs() {
    if (!this.ws) {
      try {
        this.ws = new WS(WS_BASE, { proxy: this.proxy });
        this.loginWs();
      } catch (e) {
        console.log('initWs error');
        process.exit();
      }
    }

    this.wsTicks = (o, cb) => this._addChanel('ticks', o, cb);
    this.wsKline = (o, cb) => this._addChanel('ohlc', o, cb);
    this.wsDepth = (o, cb) => this._addChanel('book', o, cb);
  }
  loginWs() {
    if (!this.apiSecret) return;
    const endpoint = 'GetWebSocketsToken';
    const { ws } = this;
    if (!ws || !ws.isReady()) return setTimeout(() => this.loginWs(), 100);

    // 发起登录请求
    ws.onLogin(() => {
      this.isWsLogin = true;
    });
  }

  _addChanel(wsName, o = {}, cb) {
    const { ws } = this;
    const fns = kUtils.ws[wsName];
    if (fns.notNull) checkKey(o, fns.notNull);
    if (!ws || !ws.isReady()) return setTimeout(() => this._addChanel(wsName, o, cb), 100);
    if (fns.isSign && !this.isWsLogin) return setTimeout(() => this._addChanel(wsName, o, cb), 100);

    const chanel = kUtils.ws.getChanelObject({
      ...o,
      name: fns.name
    });
    //
    const validate = res => {
      return  Array.isArray(res) ? new RegExp(fns.name).test(_.get(res, '2')) : true;
    };
    

    ws.send(chanel);
    const callback = this.genWsDataCallBack(cb, fns.formater);
    ws.onData(validate, callback);
  }

  genWsDataCallBack(cb, formater) {
    return (ds) => {

      if (!ds) return [];

      cb(formater(ds));
      // const error_code = _.get(ds, 'error_code') || _.get(ds, '0.error_code') || _.get(ds, '0.data.error_code');
      // if (error_code) {
      //   const str = `${ds.error_message || error.getErrorFromCode(error_code)} | [ws]`;
      //   throw new Error(str);
      // }
      // cb(formater(ds));
    };
  }
  
  _genHeader(method, endpoint, params, isSign) { // 根据本站改写
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
      headers: this._genHeader(method, endpoint, params, isSign),
      ...(method === 'GET' ? {} : { body: JSON.stringify(params) })
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
    if (body.error && body.error.length) {
      const msg = body.error.join(';');
      console.log(`${msg} | ${endpoint}`, endpoint, params);
      return { error: msg };
    }
    if (body.error_message) {
      return {
        error: body.error_message
      };
      // return Utils.throwError(body.error_message);
    }
    // if (url && url.indexOf('margin/v3/cancel_batch_orders') !== -1) {
    //   console.log(o, body.data || body || false, '0o2032');
    // }
    return body.data || body || false;
  }

  async updatePairs() {
    const pairs = this.pairs = await this.pairs();
    if (pairs && pairs.length) this.saveConfig(pairs, 'pairs');
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

