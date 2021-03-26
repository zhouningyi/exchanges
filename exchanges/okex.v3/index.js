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
const { USER_AGENT, WS_BASE } = require('./config');
const okConfig = require('./meta/api');
const future_pairs = require('./meta/future_pairs.json');
const swapUtils = require('./utils/swap');
const spotUtils = require('./utils/spot');
const futureUtils = require('./utils/future');
const ef = require('./../../utils/formatter');

//
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
  getPairs(o = {}) {
    const { assets, pairs } = o;
    if (assets) return _.map(assets, a => a.pair);
    return pairs || future_pairs;
  }
  //
  initWs(o = {}) {
    if (!this.ws) {
      try {
        this.ws = kUtils.ws.genWs(WS_BASE, { proxy: this.proxy });
        this.loginWs();
      } catch (e) {
        console.log('initWs error');
        process.exit();
      }
    }
    this.wsFutureIndex = (o, cb) => this._addChanelV3('futureIndex', { pairs: this.getPairs(o) }, cb);
    this.wsTicks = (o, cb) => this._addChanelV3('ticks', { pairs: this.getPairs(o) }, cb);
    this.wsFutureDepth = (o, cb) => this._addChanelV3('futureDepth', { ...o, pairs: this.getPairs(o) }, cb);
    this.wsFutureTicks = (o, cb) => this._addChanelV3('futureTicks', { pairs: this.getPairs(o), contract_type: o.contract_type }, cb);
    this.wsFuturePositions = (o, cb) => this._addChanelV3('futurePositions', o, cb);
    this.wsFutureBalances = (o, cb) => this._addChanelV3('futureBalances', o, cb);
    this.wsFutureOrders = (o, cb) => this._addChanelV3('futureOrders', o, cb);
    this.wsSpotOrders = (o, cb) => this._addChanelV3('spotOrders', o, cb);
    this.wsSpotDepth = (o, cb) => this._addChanelV3('spotDepth', { pairs: this.getPairs(o) }, cb);
    this.wsSpotBalances = (o, cb) => this._addChanelV3('spotBalances', o, cb);
    this.wsSwapTicks = (o, cb) => this._addChanelV3('swapTicks', o, cb);
    this.wsSwapDepth = (o, cb) => this._addChanelV3('swapDepth', o, cb);
    this.wsSwapFundRate = (o, cb) => this._addChanelV3('swapFundRate', o, cb);
    this.wsSwapEstimateFunding = (o, cb) => this._addChanelV3('swapEstimateFunding', o, cb);
    this.wsMarginBalance = (o, cb) => this._addChanelV3('marginBalance', o, cb);
    this.wsSwapBalances = (o, cb) => this._addChanelV3('swapBalances', o, cb);
    this.wsSwapPositions = (o, cb) => this._addChanelV3('swapPositions', o, cb);
    this.wsSwapOrders = (o, cb) => this._addChanelV3('swapOrders', o, cb);
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
    const callback = this.genWsDataCallBack(cb, fns.formater, wsName);
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
      'OK-ACCESS-KEY': this.apiKey,
      'OK-ACCESS-SIGN': isSign ? this.getSignature(method, time, endpoint, params) : '',
      'OK-ACCESS-TIMESTAMP': `${time}`,
      'OK-ACCESS-PASSPHRASE': this.passphrase
    };
  }
  async swapFundHistoryPage({ pair, page = 1 }) {
    const url = `https://www.okex.com/v2/perpetual/pc/public/fundingRate?contract=${pair}-SWAP&current=${page}`;
    const ds = await request({ url });
    if (!ds) return null;
    const { data } = ds;
    if (!data) return null;
    const { fundingRates } = data;
    if (!fundingRates) return null;
    const coin = pair.split('-')[0];
    return _.map(fundingRates, (d) => {
      const time = new Date(d.createTime);
      const tsr = Math.floor(time.getTime() / 1000);
      return {
        unique_id: `${pair}_${tsr}`,
        time,
        coin,
        pair,
        funding_rate: _parse(d.fundingRate),
        realized_rate: _parse(d.realFundingRate),
        realized_amount: _parse(d.realFundingFee),
        interest_rate: _parse(d.interest_rate),
      };
    });
  }
  async swapKlinePage(o) {
    const opt = swapUtils.swapKlineO(o);
    const { granularity, instrument_id } = opt;
    const url = `https://www.okex.com/v2/perpetual/pc/public/instruments/${instrument_id}/candles?granularity=${granularity}&size=1000`;
    const ds = await request({ url });
    if (!ds) return null;
    const { data } = ds;
    if (!Array.isArray(data)) return null;
    return _.map(data, (d) => {
      return swapUtils.formatSwapKline(d, o);
    }).filter(klinePageFilter);
  }
  async futureKlinePage(o) {
    const opt = futureUtils.futureKlineO(o);
    const { granularity, instrument_id } = opt;
    const url = `https://www.okex.com/v3/futures/pc/market/${instrument_id}/candles?granularity=${granularity}&size=1440`;
    const ds = await request({ url });
    if (!ds) return null;
    const { data } = ds;
    if (!Array.isArray(data)) return null;
    return _.map(data, (d) => {
      return futureUtils.formatFutureKline(d, o);
    }).filter(klinePageFilter);
  }
  async spotKlinePage(o) {
    const opt = spotUtils.spotKlineO(o);
    const url = `https://www.okex.com/v2/spot/instruments/${o.pair}/candles?granularity=${opt.granularity}&size=1000`;
    const ds = await request({ url });
    if (!ds) return null;
    const { data } = ds;
    if (!Array.isArray(data)) return null;
    return _.map(data.slice(1), (d) => {
      return spotUtils.formatSpotKline(d, o);
    }).filter(klinePageFilter);
  }
  async indexKlinePage(o) {
    const opt = spotUtils.spotKlineO(o);
    const url = `https://www.okex.com/api/index/v3/instruments/${o.pair}/candles?granularity=${opt.granularity}&size=1000`;
    const ds = await request({ url });
    if (!ds) return null;
    const { data } = ds;
    return _.map(data.slice(1), (d) => {
      return spotUtils.formatSpotKline(d, o);
    }).filter(klinePageFilter);
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

    // console.log(o);


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
  _getAssetBaseType(o) {
    if (ef.isFuture(o)) return 'future';
    if (ef.isSwap(o)) return 'swap';
    if (ef.isSpot(o)) return 'spot';
    return 'none';
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
  _compatible() {
    this.updateAssetLeverate = async (o = {}) => {
      const baseType = this._getAssetBaseType(o);
      const coin = ef.getCoin(o);
      const fnName = `${baseType}UpdateLeverate`;
      if (this[fnName]) {
        return await this[fnName]({ ...o, coin });
      } else {
        console.log(`updateAssetLeverate/缺少:${fnName}...`);
      }
    };
    //
    ['currentFunding', 'fundingHistory'].forEach((name) => {
      this[name] = async (o = {}) => {
        const baseType = this._getAssetBaseType(o);
        const fnName = `${baseType}${_.upperFirst(name)}`;
        if (this[fnName]) {
          return await this[fnName]({ ...o });
        } else {
          console.log(`${name}/缺少函数:${fnName}...`);
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
}

module.exports = Exchange;

