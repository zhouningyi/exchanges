// const Utils = require('./utils');
// const deepmerge = require('deepmerge');
const _ = require('lodash');
const error = require('./errors');
const Base = require('./../base');
const kUtils = require('./utils');
const Utils = require('./../../utils');
const moment = require('moment');
const request = require('./../../utils/request');
const futureUtils = require('./utils/future');
const { FUTURE_BASE, REST_BASE, WS_BASE, WS_BASE_ACCOUNT, WS_BASE_FUTURE, WS_BASE_FUTURE_ACCOUNT } = require('./config');
const restConfig = require('./meta/api');
const HmacSHA256 = require('crypto-js/hmac-sha256');
const CryptoJS = require('crypto-js');
const future_pairs = require('./meta/future_pairs.json');


function fixPath(v) {
  if (v.startsWith('/')) return v;
  return `/${v}`;
}

//
const { checkKey } = Utils;
//
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'
};

// function mergeArray(data, d) {
//   return data.concat(data, d);
// }

function merge(data, d) {
  return { ...data, ...d };
}

class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.url = URL;
    this.version = 'v1';
    this.name = 'huobi';
    this.hostMap = {
      future: FUTURE_BASE
    };
    this.init();
  }
  async init() {
    this.Utils = kUtils;
    this.loadFnFromConfig(restConfig);
    this.initWsPublic();
    this.initWsAccount();
    this.initWsFuturePublic();
    this.initWsFutureAccount();
    await Promise.all([this.updateAccount(), this.updatePairs(), this.updateFuturePairs()]);
  }
  getFutureCoins() {
    const ps = futureUtils.getDefaultFuturePairs();
    return _.map(ps, p => p.split('-')[0]);
  }
  _getBody(params) {
    const t = moment.utc().format('YYYY-MM-DDTHH:mm:ss');
    return {
      AccessKeyId: this.apiKey,
      SignatureMethod: 'HmacSHA256',
      SignatureVersion: '2',
      Timestamp: t,
      ...params
    };
  }

  signSha(method, baseurl, path, data) {
    const pars = [];
    for (const k in data) {
      pars.push(`${k}=${encodeURIComponent(data[k])}`);
    }
    let p = pars.sort().join('&');
    const signature = encodeURIComponent(this._signSha(method, baseurl, path, data));
    p += `&Signature=${signature}`;
    return p;
  }
  _signSha(method, baseurl, path, data) {
    const pars = [];
    for (const k in data) {
      pars.push(`${k}=${encodeURIComponent(data[k])}`);
    }
    const p = pars.sort().join('&');
    const meta = [method, baseurl, fixPath(path), p].join('\n');
    const hash = HmacSHA256(meta, this.apiSecret);
    return CryptoJS.enc.Base64.stringify(hash);
  }
  async updateAccount() {
    if (!this.apiKey) return null;
    const ds = await this.accounts();
    const accountMap = this.accountMap = {};
    _.forEach(ds, (d) => {
      accountMap[`${d.type}Id`] = d.id;
    });
    this.queryOptions = Object.assign(this.queryOptions || {}, accountMap);
  }
  async updatePairs() {
    const pairs = this.pairs = await this.pairs();
    if (pairs && pairs.length) this.saveConfig(pairs, 'pairs');
  }
  async updateFuturePairs() {
    const pairs = this._pairs = await this.futurePairs();
    if (pairs && pairs.length) this.saveConfig(pairs, 'future_pairs_detail');
  }
  _getTime() {
    return new Date().toISOString();
  }
  getFuturePairs(o = {}) {
    return o.pairs || futureUtils.getDefaultFuturePairs();
  }
  initWsFutureAccount() {
    const wsName = 'wsFutureAccount';
    if (!this[wsName]) {
      try {
        this[wsName] = kUtils.ws.genWs(WS_BASE_FUTURE_ACCOUNT, { proxy: this.proxy });
        this.loginWs({ url: 'api.hbdm.com', path: '/notification', wsName, options: { type: 'api' } });
      } catch (e) {
        console.log(e, 'initWs error');
        process.exit();
      }
    }
    const _o = { wsName };
    this.wsFutureOrders = (options, cb) => this._addChanel('futureOrders', { ...options, pairs: this.getFuturePairs(options), ..._o }, cb);
    this.wsFuturePosition = (options, cb) => this._addChanel('futurePosition', { ...options, pairs: this.getFuturePairs(options), ..._o }, cb);
    this.wsFutureBalance = (options, cb) => this._addChanel('futureBalance', { ...options, pairs: this.getFuturePairs(options), ..._o }, cb);
    // this.wsFutureTicks = (options, cb) => this._addChanel('futureTicks', { ...options, pairs: this.getFuturePairs(options), ..._o }, cb);
  }
  initWsFuturePublic(o = {}) {
    const wsName = 'wsFuturePublic';
    if (!this[wsName]) {
      try {
        this[wsName] = kUtils.ws.genWs(WS_BASE_FUTURE, { proxy: this.proxy });
      } catch (e) {
        console.log(e, 'initWs error');
        process.exit();
      }
    }
    const _o = { wsName };
    this.wsFutureDepth = (options, cb) => this._addChanel('futureDepth', { ...options, pairs: this.getFuturePairs(options), ..._o }, cb);
    this.wsFutureTicks = (options, cb) => this._addChanel('futureTicks', { ...options, pairs: this.getFuturePairs(options), ..._o }, cb);
  }
  //
  initWsPublic(o = {}) {
    const wsName = 'wsPublic';
    if (!this[wsName]) {
      try {
        this[wsName] = kUtils.ws.genWs(WS_BASE, { proxy: this.proxy });
      } catch (e) {
        console.log(e, 'initWs error');
        process.exit();
      }
    }
    const _o = { wsName };
    this.wsSpotDepth = (options, cb) => this._addChanel('spotDepth', { pairs: this.getFuturePairs(o), ..._o }, cb);
  }
  initWsAccount(o = {}) {
    const wsName = 'wsAccount';
    if (!this.wsAccount) {
      try {
        this[wsName] = kUtils.ws.genWs(WS_BASE_ACCOUNT, { proxy: this.proxy });
        this.loginWs({ url: 'api.huobi.pro', path: '/ws/v1', wsName });
      } catch (e) {
        console.log(e, 'initWs error');
        process.exit();
      }
    }
    this.wsSpotBalance = (options, cb) => this._addChanel('spotBalance', { wsName, options }, cb);
    this.wsSpotOrders = (options, cb) => this._addChanel('spotOrders', { wsName, options }, cb);
  }
  _addChanel(wsName, o = {}, cb) {
    const ws = this[o.wsName];
    const fns = kUtils.ws[wsName];
    if (fns.notNull) checkKey(o, fns.notNull);
    if (!ws || !ws.isReady()) return setTimeout(() => this._addChanel(wsName, o, cb), 100);
    if (fns.isSign && !this.isWsLogin) return setTimeout(() => this._addChanel(wsName, o, cb), 100);

    const chanel = fns.chanel(o, { ...this.queryOptions, ...o.options });
    // if (Array.isArray(chanel)) chanel = _.map(chanel, c => kUtils.ws.getChanelObject(c, wsName));
    const topicValidate = res => res.topic === fns.topic;
    const noLoginValidate = (res) => {
      return res.ch && res.ch.indexOf(`.${wsName}`) !== -1;
    };
    const validate = fns.validate || (fns.topic ? topicValidate : noLoginValidate);
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
  loginWs(o = {}) {
    if (!this.apiSecret) return;
    const { url, path, wsName, options } = o;
    const ws = this[wsName];
    if (!ws) return setTimeout(() => this.loginWs(o), 100);
    ws.onOpen(() => {
      const data = {
        ...options,
        ...this._getBody(),
        Signature: this._signSha('GET', url, path, this._getBody()),
        op: 'auth',
      };
      ws.send(data);
      ws.onLogin(() => {
        this.print('ws login...', 'gray');
        this.isWsLogin = true;
      });
    });
  }
  getHost(hostId) {
    if (this.hostMap[hostId]) return this.hostMap[hostId];
    return REST_BASE;
  }
  async request(method = 'GET', endpoint, params = {}, isSign = false, hostId) {
    const { options } = this;
    params = Utils.cleanObjectNull(params);
    params = _.cloneDeep(params);
    // const qstr = Utils.getQueryString(params);
    let url;
    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else {
      const base = this.getHost(hostId);
      url = `https://${base}/${endpoint}`;
    }

    let qstr = '';
    if (isSign) {
      const info = this._getBody(method === 'GET' ? params : {});
      const payload = this.signSha(method, this.getHost(hostId), endpoint, info);
      qstr = payload; // [payload].join('&');// qstr,
    }
    if (qstr && isSign) url = `${url}?${qstr}`;
    const o = {
      timeout: options.timeout,
      uri: url,
      proxy: this.proxy,
      method,
      headers: {
        ...DEFAULT_HEADERS,
      },
    };

    if (method === 'POST') o.body = JSON.stringify(this._getBody(params));
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
      console.log(method, `${endpoint}: ${body.msg}`);
      return false;
    }
    if (body.status === 'error') {
      const errMsg = body['err-msg'] || body.err_msg;
      console.log(method, `${errMsg} | ${endpoint}`, params);
      return { error: errMsg };
    }
    if (body.error) {
      const errMsg = body.error;
      console.log(method, `${errMsg} | ${method}: ${endpoint}`, params);
      return { error: errMsg };
    }
    if (body.error_message) {
      return {
        error: body.error_message
      };
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

