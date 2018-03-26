// const Utils = require('./utils');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const _ = require('lodash');
const kUtils = require('./utils');
const Utils = require('./../../utils');

const { checkKey } = Utils;
//
const URL = 'https://api.kucoin.com';
class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.url = URL;
    this.version = 'v1';
  }
  getSignature(path, queryStr, nonce) {
    const strForSign = `/${path}/${nonce}/${queryStr}`;
    const signatureStr = new Buffer(strForSign).toString('base64');
    const signatureResult = crypto.createHmac('sha256', this.apiSecret)
      .update(signatureStr)
      .digest('hex');
    return signatureResult;
  }
  // 下订单
  async order(o = {}) {
    checkKey(o, ['pair', 'price', 'amount']);
    o = kUtils.formatOrderO(o);
    Utils.print(`${o.side} - ${o.pair} - ${o.amount}`, 'red');
    const ds = await this.post('order', o);
    return ds ? { orderId: ds.orderOid } : null;
  }
  // async pairs(o = {}) {
  //   const ds = await this.get('open/markets', o);
  //   return ds;
  // }
  async fastOrder(o = {}) {
    checkKey(o, ['amount', 'side', 'pair', 'price']);
    const waitTime = 200;
    const ds = await this.order(o);
    await Utils.delay(waitTime);
    if (!ds) return null;
    const { orderId } = ds;
    const orderInfo = await this.orderInfo({ orderId, pair: o.pair, side: o.side });
    if (!orderInfo) return;
    const { pendingAmount, dealAmount } = orderInfo;
    if (pendingAmount === 0) return orderInfo;
    await this.cancelOrder({
      orderId, pair: o.pair, side: o.side
    });
    return { ...orderInfo, pendingAmount: 0, dealAmount };
  }
  async activeOrders(o = {}) {
    const ds = await this.get('order/active', o);
    return ds;
  }
  async cancelAllOrders(o = {}) {
    const ds = await this.post('order/cancel-all', {});
    return ds;
  }
  async orderInfo(o) {
    checkKey(o, ['orderId', 'side', 'pair']);
    const opt = Utils.replace(o, { orderId: 'orderOid', side: 'type' });
    const ds = await this.get('order/detail', opt);
    return ds ? {
      orderId: o.orderId,
      side: o.side,
      dealAmount: ds.dealAmount,
      pendingAmount: ds.pendingAmount,
      create_time: new Date(ds.createdAt)
    } : null;
  }
  async cancelOrder(o = {}) {
    checkKey(o, ['orderId', 'side']);
    const opt = Utils.replace(o, { orderId: 'orderOid', side: 'type' });
    const ds = await this.post('cancel-order', opt);
    return ds ? {
      orderId: o.orderId,
      side: o.side,
      success: ds.success,
      time: new Date(ds.timestamp)
    } : null;
  }
  async balances(o = {}) {
    const defaultO = {
      limit: 20// 最多是20个
    };
    let ds = await this.get('account/balances', { ...defaultO, ...o });
    ds = kUtils.getFilteredBalances(ds.datas);
    return ds;
  }
  async coin(o = {}) {
    return await this.get('market/open/coin-info', o);
  }
  async coins(o) {
    return await this.get('market/open/coins', o);
  }
  async currencies(o) {
    return await this.get('open/currencies', o);
  }
  async kline(params = {}) {
    params = kUtils.formatTime(params);
    params = Utils.replace(params, {
      startTime: 'from',
      endTime: 'to',
    });
    const ds = await this.get('open/chart/history', params);
    const { l, h, c, o, v, t } = ds;
    return _.map(ds.l, (d, i) => {
      return {
        low: l[i],
        high: h[i],
        close: c[i],
        open: o[i],
        volume: v[i],
        open_time: new Date(t[i] * 1000)
      };
    });
  }
  async userInfo() {
    const ds = await this.get('user/info', {});
    return ds;
  }
  async ticks() {
    const ds = await this.get('open/tick', {});
    return kUtils.formatTicks(ds);
  }
  async prices() {
    const ds = await this.get('market/open/symbols', {});
    return kUtils.formatPrices(ds);
  }
  async orderBook(o = {}) {
    const ds = await this.get('open/orders', o);
    const _map = d => ({
      price: d[0],
      amount: d[1],
      volume: d[2]
    });
    return {
      sell: _.map(ds.SELL, _map), // SELL
      buy: _.map(ds.BUY, _map), // BUY
    };
  }
  async request(method = 'GET', endpoint, params = {}, data) {
    params = Utils.replace(params, { pair: 'symbol' });
    const signed = this.apiKey && this.apiSecret;
    const _path = `${this.version}/${endpoint}`;
    const pth = `${this.url}/${_path}`;
    const nonce = new Date().getTime();
    const qstr = Utils.getQueryString(params);
    const url = qstr ? `${pth}?${qstr}` : pth;
    const cType = 'application/x-www-form-urlencoded';
    const o = {
      uri: url,
      proxy: this.proxy,
      method,
      headers: {
        'Content-Type': cType,
        ...(signed ? {
          'KC-API-KEY': this.apiKey,
          'KC-API-NONCE': nonce,
          'KC-API-SIGNATURE': this.getSignature(_path, qstr, nonce)
        } : {})
      }
    };
    try {
      // console.log(o);
      const body = await request(o);
      if (url.indexOf('order') !== -1) {
        console.log(body);
      }
      const { error, msg, code } = body;
      if (code === 'Forbidden') throw msg;
      if (code === 'ERROR') throw msg;
      if (code === 'UNAUTH') throw msg;
      if (error) throw error;
      return body.data || body;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }
}

module.exports = Exchange;
