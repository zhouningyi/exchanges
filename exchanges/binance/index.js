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
const wsFunctionConfig = require('./meta/ws');
const { upperFirst } = require('lodash');

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
    this.compatible();
  }
  async init() {
    this.timeOffset = 0;
    this.Utils = kUtils;
    this.loadFnFromConfig(apiConfig);
    this.initWs();
    await this.syncTime();
  }
  async syncTime() {
    const time = await this.time();
    this.timeOffset = time.timestamp - new Date().getTime();
  }
  getSignature(method, endpoint, params, isws = false) {
    method = method.toUpperCase();
    const totalStr = makeQueryString(params, true);
    return crypto.createHmac('sha256', this.apiSecret).update(totalStr).digest('hex');// .toString('base64');
  }
  _getTime() {
    return new Date().toISOString();
  }
  getUrlBase(o) {
    const { host = 'spot' } = o;
    if (host === 'spot') return SPOT_REST_BASE;
    if (host === 'usdt_contract') return USDT_CONTRACT_REST_BASE;
    if (host === 'coin_contract') return COIN_CONTRACT_REST_BASE;
  }
  //
  initWs(o = {}) {
    if (!this.ws) {
      try {
        const ws = this.ws = kUtils.ws.genWs(this, { proxy: this.proxy });
        ws.loadConfigs(wsFunctionConfig);
      } catch (e) {
        console.log(e, 'initWs error');
        process.exit();
      }
    }
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
    if (isSign) params.timestamp = new Date().getTime() + this.timeOffset;// + hour8;
    // params.recvWindow = this.options.recvWindow;
    const qstr = makeQueryString(params, true);
    // if (!params.recvWindow) params.recvWindow = this.options.recvWindow;
    const REST_BASE = this.getUrlBase({ host });
    let url;
    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else {
      url = `${REST_BASE}/${endpoint}`;
    }
    if (method !== 'POST' && qstr) url += `?${qstr}`;
    if (isSign) {
      // console.log(method, endpoint, params, 'method, endpoint, params....');
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
      ...(method === 'POST' ? { form: params } : { qs: params })
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
  _isCoinContract(o) {
    const { pair, asset_type } = o;
    return isFuture(asset_type) && pair && pair.toUpperCase().endsWith('USD');
  }
  _isUsdtContract(o) {
    const { pair, asset_type } = o;
    return isFuture(asset_type) && pair && pair.toUpperCase().endsWith('USDT');
  }
  _isSpot(o) {
    const { asset_type } = o;
    return asset_type && asset_type.toLowerCase() === 'spot';
  }
  _getAssetBaseType(o) {
    if (this._isCoinContract(o)) return 'coinContract';
    if (this._isUsdtContract(o)) return 'usdtContract';
    if (this._isSpot(o)) return 'spot';
    return 'none';
  }
  parseAssets(o) {
    let { assets, pair, asset_type } = o;
    if (assets) return assets;
    assets = [];
    if (typeof pair === 'string') pair = [pair];
    if (typeof asset_type === 'string') asset_type = [asset_type];
    for (const _asset_type of asset_type) {
      for (const _pair of pair) {
        assets.push({ asset_type: _asset_type, pair: _pair });
      }
    }
    return assets;
  }
  compatible() {
    // REST
    this.coinContractBatchCancelOrders = async (orders) => {
      const res = [];
      for (const order of orders) {
        const _res = await this.coinContractCancelOrder(order);
        if (_res) res.push(_res);
      }
      return res;
    };
    this.assetBatchCancelOrders = async (orders) => {
      const ordersGroup = _.groupBy(orders, d => this._getAssetBaseType(d));
      let res = [];
      for (const baseType in ordersGroup) {
        const orders = ordersGroup[baseType];
        if (orders && orders.length) {
          const realFnName = `${baseType}BatchCancelOrders`;
          const _res = await this[realFnName](orders);
          if (_res) res = [..._res];
        }
      }
      return res;
    };
    this.registerFn({ name: 'orders' }, async (o = {}) => {
      const { status, assetBaseType, assets, ...rest } = o;
      const fnName = status === 'UNFINISH' ? `${assetBaseType}UnfinishOrders` : `${assetBaseType}Orders`;
      if (!this[fnName]) return console.log(`函数${fnName}不存在...`);
      let res = [];
      for (const asset of assets) {
        const ds = await this[fnName]({ ...rest, ...asset });
        if (Array.isArray(ds)) res = [...res, ...ds];
      }
      return res;
    });
    //

    const filterByInstrumentId = (ds, o) => {
      if (!ds || !o || !o.assets) return ds;
      const { assets } = o;
      const instrument_ids = _.map(assets, Utils.formatter.getInstrumentId);
      return _.filter(ds, d => instrument_ids.includes(d.instrument_id) || d.vector);
    };

    const filterBalances = (ds, o) => {
      if (!ds || !o || !o.assets) return ds;
      const { assets } = o;
      const balance_ids = _.map(assets, Utils.formatter.getBalanceId);
      return _.filter(ds, d => balance_ids.includes(d.unique_id) || d.balance);
    };

    const resFns0 = ['balances', 'assets', 'positions'];
    for (const name of resFns0) {
      this.registerFn({ name }, async (o = {}) => {
        const wsFnName = `wsRequest${upperFirst(o.assetBaseType)}${upperFirst(name)}`;
        let ds;
        if (this[wsFnName] && (name !== 'balances')) {
          ds = await this[wsFnName]();
        } else {
          const restFnName = `${o.assetBaseType}${upperFirst(name)}`;
          ds = await this[restFnName]();
        }
        if (name === 'balances') return filterBalances(ds, o);
        if (['positions', 'assets'].includes(name)) return filterByInstrumentId(ds, o);
        console.log(`resFns0/name:${name} UNKNOW...`);
      });
    }

    const restFns = ['order', 'orderInfo', 'cancelOrder'];
    for (const name of restFns) {
      const fnName = `asset${upperFirst(name)}`;
      this[fnName] = async (o) => {
        const baseType = this._getAssetBaseType(o);
        const realFnName = `${baseType}${upperFirst(name)}`;
        if (this[realFnName]) {
          return await this[realFnName](o);
        } else {
          this.print(`compatible: rest函数${realFnName}不存在...`);
        }
      };
    }
    // WS
    const wsFns = ['orders', 'positions', 'balances', 'depth', 'ticks'];
    for (const name of wsFns) {
      const fnName = `subscribeAsset${upperFirst(name)}`;
      this[fnName] = async (o, cb) => {
        const assets = this.parseAssets(o);
        const assetsGroup = _.groupBy(assets, this._getAssetBaseType.bind(this));
        for (const assetBaseType in assetsGroup) {
          const realFnName = `ws${upperFirst(assetBaseType)}${upperFirst(name)}`;
          const _assets = assetsGroup[assetBaseType];
          if (this[realFnName]) {
            this[realFnName]({ ...o, assets: _assets }, (ds) => {
              if (name === 'balances') ds = filterBalances(ds, o);
              if (name === 'positions') ds = filterByInstrumentId(ds, o);
              cb(ds);
            });
          } else {
            this.print(`compatible: ws函数${realFnName}不存在...`);
          }
        }
      };
    }
  }
}

function isFuture(asset_type) {
  if (!asset_type) return false;
  return ['swap', 'quarter', 'next_quarter'].includes(asset_type.toLowerCase());
}

Exchange.options = {
  recvWindow: 5000
};

module.exports = Exchange;

