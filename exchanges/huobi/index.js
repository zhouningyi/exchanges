// const Utils = require('./utils');
// const deepmerge = require('deepmerge');
const _ = require('lodash');
const error = require('./errors');
const Base = require('./../base');
const kUtils = require('./utils');
const Utils = require('./../../utils');
const ef = require('./../../utils/formatter');
const moment = require('moment');
const request = require('./../../utils/request');
const futureUtils = require('./utils/future');
const { FUTURE_BASE, REST_BASE, WS_BASE, REST_HUOBI_GROUP, WS_BASE_COIN_SWAP_INDEX, WS_BASE_ACCOUNT, WS_BASE_COIN_SWAP_ACCOUNT, WS_BASE_COIN_SWAP, WS_BASE_FUTURE, WS_BASE_ACCOUNT_V2, WS_BASE_FUTURE_ACCOUNT } = require('./config');
const restConfig = require('./meta/api');
const HmacSHA256 = require('crypto-js/hmac-sha256');
const CryptoJS = require('crypto-js');
const spotUtils = require('./utils/spot');


const { upperFirst } = _;
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
      spot: REST_BASE,
      future: FUTURE_BASE,
      huobigroup: REST_HUOBI_GROUP
    };
    this.init();
  }
  async init() {
    this.Utils = kUtils;
    this.loadFnFromConfig(restConfig);
    //
    this.initWsPublic();
    this.initWsSpotAccount();
    //
    this.initWsFuturePublic();
    this.initWsFutureAccount();
    //
    this.initWsCoinSwapPublic();
    this.initWsCoinSwapIndex();
    this.initWsCoinSwapAccount();
    await Promise.all([this.updateAccount()]);
  }
  getFutureCoins() {
    const ps = futureUtils.getDefaultFuturePairs();
    return _.map(ps, p => p.split('-')[0]);
  }
  _getBody(params, version = '2') {
    const t = moment.utc().format('YYYY-MM-DDTHH:mm:ss');
    if (version === '2.1') {
      return {
        accessKey: this.apiKey,
        signatureMethod: 'HmacSHA256',
        signatureVersion: '2.1',
        timestamp: t
      };
    }
    return {
      AccessKeyId: this.apiKey,
      SignatureMethod: 'HmacSHA256',
      SignatureVersion: version,
      Timestamp: t,
      ...params
    };
  }

  signSha(method, baseurl, path, data, isEncode = true) {
    const pars = [];
    for (const k in data) {
      pars.push(`${k}=${isEncode ? encodeURIComponent(data[k]) : data[k]}`);
    }
    let p = pars.sort().join('&');
    let signature = this._signSha(method, baseurl, path, data);
    if (isEncode)signature = encodeURIComponent(signature);
    p += `&Signature=${signature}`;
    return p;
  }
  _signSha(method, baseurl, path, data, isEncode = true) {
    const pars = [];
    for (const k in data) {
      pars.push(`${k}=${isEncode ? encodeURIComponent(data[k]) : data[k]}`);
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
    const pairs = this.pairs = await this.spotAssets();
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
    this.wsFutureOrders = (options, cb) => this._addChanel('futureOrders', { ...options, ..._o }, cb);
    this.wsFuturePositions = (options, cb) => this._addChanel('futurePosition', { ...options, ..._o }, cb);
    this.wsFutureBalances = (options, cb) => this._addChanel('futureBalance', { ...options, ..._o }, cb);
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
    this.wsFutureDepth = (options, cb) => this._addChanel('futureDepth', { ...options, ..._o }, cb);
    this.wsFutureTicks = (options, cb) => this._addChanel('futureTicks', { ...options, ..._o }, cb);
  }
  initWsCoinSwapPublic(o = {}) {
    const wsName = 'wsCoinSwapPublic';
    if (!this[wsName]) {
      try {
        this[wsName] = kUtils.ws.genWs(WS_BASE_COIN_SWAP, { proxy: this.proxy });
      } catch (e) {
        console.log(e, 'initWs error');
        process.exit();
      }
    }
    const _o = { wsName };
    this.wsCoinSwapDepth = (options, cb) => this._addChanel('coinSwapDepth', { ...options, ..._o }, cb);
  }
  initWsCoinSwapIndex(o = {}) {
    const wsName = 'wsCoinSwapIndex';
    if (!this[wsName]) {
      try {
        this[wsName] = kUtils.ws.genWs(WS_BASE_COIN_SWAP_INDEX, { proxy: this.proxy });
      } catch (e) {
        console.log(e, 'initWs error');
        process.exit();
      }
    }
    const _o = { wsName };
    this.wsCoinSwapEstimateFunding = (options, cb) => this._addChanel('coinSwapEstimateFunding', { ...options, ..._o }, cb);
  }
  initWsCoinSwapAccount(o = {}) {
    const wsName = 'wsCoinSwapAccount';
    if (!this[wsName]) {
      try {
        this[wsName] = kUtils.ws.genWs(WS_BASE_COIN_SWAP_ACCOUNT, { proxy: this.proxy });
        this.loginWs({ url: 'api.hbdm.com', path: '/swap-notification', wsName, options: { type: 'api' } });
      } catch (e) {
        console.log(e, 'initWs error');
        process.exit();
      }
    }
    this.wsCoinSwapOrders = (options, cb) => this._addChanel('coinSwapOrders', { wsName, options }, cb);
    this.wsCoinSwapBalances = (options, cb) => this._addChanel('coinSwapBalance', { wsName, options }, cb);
    this.wsCoinSwapPositions = (options, cb) => this._addChanel('coinSwapPosition', { wsName, options }, cb);
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
    this.wsSpotDepth = (options, cb) => this._addChanel('spotDepth', { ...options, ..._o }, cb);
  }
  initWsSpotAccount(o = {}) {
    const wsName = 'wsAccount';
    if (!this.wsAccount) {
      try {
        this[wsName] = kUtils.ws.genWs(WS_BASE_ACCOUNT_V2, { proxy: this.proxy });
        this.loginWs({ url: 'api.huobi.pro', path: '/ws/v2', wsName });
      } catch (e) {
        console.log(e, 'initWs error');
        process.exit();
      }
    }
    this.wsSpotBalances = (options, cb) => this._addChanel('spotBalance', { wsName, options }, cb);
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
      ds = formater(ds);
      ds = this.wrapperInfo(ds);
      cb(ds);
    };
  }
  loginWs(o = {}) {
    if (!this.apiSecret) return;
    const { url, path, wsName, options } = o;
    const ws = this[wsName];
    if (!ws) return setTimeout(() => this.loginWs(o), 100);
    ws.onOpen(() => {
      let data = null;
      if (path === '/ws/v2') {
        const body = this._getBody(null, '2.1');
        data = {
          action: 'req',
          ch: 'auth',
          params: {
            authType: 'api',
            ...body,
            signature: this._signSha('GET', url, path, body),
          }
        };
      } else {
        data = {
          ...options,
          ...this._getBody(),
          Signature: this._signSha('GET', url, path, this._getBody()),
          op: 'auth',
        };
      }
      ws.send(data);
      ws.onLogin(() => {
        this.isWsLogin = true;
      });
    });
  }
  getHost(hostId) {
    if (this.hostMap[hostId]) return this.hostMap[hostId];
    return REST_BASE;
  }
  async moveBalance(o = {}) {
    const { source, target, coin, amount } = o;
    console.log(`api ${source}, ${target}, ${coin} ${amount} moveBalance.....`);
    if ([source, target].includes('FUTURE') && [source, target].includes('SPOT')) {
      return await this.futureMoveBalance({ source, target, coin, amount });
    } else if ([source, target].includes('COIN_SWAP') && [source, target].includes('SPOT')) {
      return await this.coinSwapMoveBalance({ source, target, coin, amount });
    }
  }
  async spotInterest(o) {
    const url = 'https://api.huobi.pro/v1/margin/loan-info';
    const ds = await request({ url });
    if (!ds) return null;
    const { data } = ds;
    if (!Array.isArray(data)) return null;
    return _.map(data.slice(1), (d) => {
      return spotUtils.spotInterest(d, o);
    });
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
    let qstr = Utils.getQueryString(params);
    if (isSign) {
      const info = this._getBody(method === 'GET' ? params : {});
      qstr = this.signSha(method, this.getHost(hostId), endpoint, info);
    }
    if (qstr) url = `${url}?${qstr}`;// && method === 'GET'
    // console.log(url, 'url....');
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
    // if (o.name === 'spotOrderInfoByOrderId')
    body = await request(o);
    // console.log(body, o, 8888);
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
    if (body.code === 600) {
      console.log(body.message, 'message....');
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
  async spotCancelOrder(o = {}) {
    if (o.order_id) return await this.spotCancelOrderByOrderId(o);
    if (o.client_oid) return await this.spotCancelOrderByClientOrderId(o);
    return console.log('spotCancelOrder: 必须含有order_id/client_oid');
  }
  async spotOrderInfo(o = {}) {
    if (o.order_id) return await this.spotOrderInfoByOrderId(o);
    if (o.client_oid) return await this.spotOrderInfoByClientOrderId(o);
    return console.log('spotCancelOrder: 必须含有order_id/client_oid');
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
  _getAssetBaseType(o) {
    if (ef.isFuture(o) && ef.isUsdPair(o)) return 'future';
    if (ef.isSwap(o) && ef.isUsdPair(o)) {
      return 'coinSwap';
    }
    if (ef.isSwap(o) && ef.isUsdtPair(o)) return 'usdtContract';
    if (ef.isSpot(o)) return 'spot';
    return 'none';
  }
  _compatible() {
    this.updateAssetLeverate = async (o = {}) => {
      const baseType = this._getAssetBaseType(o);
      const coin = ef.getCoin(o);
      const fnName = `${baseType}UpdateLeverate`;
      if (this[fnName]) {
        return await this[fnName]({ ...o, coin });
      } else {
        console.log(`huobi.updateAssetLeverate/缺少baseType:${baseType}...`);
      }
    };
    //
    ['currentFunding', 'fundingHistory'].forEach((name) => {
      this[name] = async (o = {}) => {
        const baseType = this._getAssetBaseType(o);
        const fnName = `${baseType}${upperFirst(name)}`;
        if (this[fnName]) {
          return await this[fnName]({ ...o });
        } else {
          console.log(999);
          console.log(`huobi.${name}/缺少baseType:${baseType}...`);
        }
      };
    });
    this.assetLedgers = async ({ assets, type }) => {
      let res = [];
      for (const asset of assets) {
        const baseType = this._getAssetBaseType(asset);
        const fnName = `${baseType}Ledger`;
        if (this[fnName]) {
          const _res = await this[fnName]({ pair: asset.pair, type });
          if (_res && _res.length) res = [...res, ..._res];
        }
      }
      return res;
    };
  }
  // calcCostFuture(o = {}) {
  //   checkKey(o, ['coin', 'side', 'amount']);
  //   const { coin, amount, side = 'BUY' } = o;
  // }
}

module.exports = Exchange;

