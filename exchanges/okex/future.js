
// const Utils = require('./utils');
// const Base = require('./../base');
// const request = require('./../../utils/request');
// const crypto = require('crypto');
const _ = require('lodash');
const kUtils = require('./utils');
const Utils = require('./../../utils');
// const md5 = require('md5');
// const error = require('./errors');
const { checkKey } = Utils;
const Spot = require('./spot');
const FUTURE_PAIRS = require('./meta/future_pairs.json');
//
class Exchange extends Spot {
  constructor(o, options) {
    super(o, options);
    this.unfinishFutureOrders = {};
  }
  // 市场类
  async futureTick(o = {}) {
    const ds = await this.get('future_ticker', o);
    return kUtils.formatTick(ds);
  }
  async futureDepth(o = {}) {
    const defaultO = {
      size: 50
    };
    checkKey(o, ['contract_type', 'pair']);
    const opt = { ...defaultO, ...o };
    const ds = await this.get('future_depth', opt);
    return kUtils.formatDepth(ds);
  }
  async futureOrderBook(o = {}) {
    const ds = await this.get('future_trades', o, true, true);
    return kUtils.formatOrderBook(ds);
  }
  async futureKlines(o = {}) {
    if (o.pair) {
      const ds = await this.futureKline(o);
      return ds;
    }
    const tasks = _.map(FUTURE_PAIRS, (pair) => {
      return this.futureKline({ ...o, pair });
    });
    const dss = await Promise.all(tasks);
    // return kUtils.formatKline(ds);
  }
  async futureKline(o = {}) {
    checkKey(o, ['pair']);
    let { pair } = o;
    const defaultFutureKlineO = {
      contract_type: 'quarter',
      interval: '1m'
    };
    o = { ...defaultFutureKlineO, ...o };
    const opt = kUtils.formatFutureKlineO(o);
    const ds = await this.get('future_kline', opt, true, true);
    if (o.isUSDT) pair += 'T';
    return kUtils.formatFutureKline(ds, { ...o, pair });
  }
  async futurePosition(o = {}) {
    checkKey(o, ['pair', 'contract_type']);
    const opt = _.pick(o, ['pair', 'contract_type']);
    const info = await this.post('future_position', opt, true);
    const ds = kUtils.formatFuturePosition(info, o);
    return ds;
  }
  wsFutureTicks(o = {}, cb) {
    const { contract_type = 'quarter' } = o;
    const pairs = o.pairs || FUTURE_PAIRS;
    const chanelString = kUtils.createWsChanelFutureTick(pairs, { contract_type });
    const reconnect = () => this.wsFutureTicks(o, cb);
    this.createWs({ timeInterval: 300, chanelString })(kUtils.formatWsFutureTick, cb, reconnect);
  }
  wsFutureKlines(o = {}, cb) {
    const symbols = o.pair ? [kUtils.formatPair(o.pair, true)] : FUTURE_PAIRS;
    const { contract_type = 'quarter', interval = '1m' } = o;
    const options = { contract_type, interval };
    const chanelString = kUtils.createWsChanelFutureKline(symbols, { contract_type, interval });
    const reconnect = () => this.wsFutureTicks(o, cb);
    this.createWs({ timeInterval: 300, chanelString, options })(kUtils.formatWsFutureKline, cb, reconnect);
  }
  wsFutureKline(o = {}, cb) {
    checkKey(o, ['pair']);
    this.wsFutureKlines(o, cb);
  }
  wsFutureDepth(o = {}, cb) {
    const symbols = o.pair ? [kUtils.formatPair(o.pair, true)] : FUTURE_PAIRS;
    const defaultO = {
      size: 50,
    };
    o = { ...defaultO, ...o };
    checkKey(o, ['contract_type']);
    const { contract_type, size } = o;
    const opt = { contract_type, size };
    const chanelString = kUtils.createWsFutureDepth(symbols, opt);
    const options = { contract_type };
    const reconnect = () => this.wsFutureDepth(o, cb);
    this.createWs({ timeInterval: 300, chanelString, options })(kUtils.formatWsFutureDepth, cb, reconnect);
  }
  async futureBalances(o = {}) {
    let ds = await this.post('future_userinfo', o, true);
    ds = kUtils.formatFutureBalances(ds);
    return ds;
  }
  async moveBalance(o = {}) {
    checkKey(o, ['source', 'target', 'amount', 'coin']);
    const opt = kUtils.formatMoveBalanceO(o);
    console.log(opt, o, 'opt....opt...opt....opt...opt....opt...');
    const ds = await this.post('future_devolve', opt, true);
    console.log(999);
    const success = !!(ds && ds.result);
    return { success };
  }
  // 市场上的交易历史
  // async futureOrderHistory(o = {}) {
  //   console.log('to do');
  //   process.exit();
  //   checkKey(o, ['pair', 'date']);
  //   const opt = kUtils.formatFutureOrderHistoryO(o);
  // }
  _updateUnfinishFutureOrders(d) {
    if (!d) return;
    const { status } = d;
    if (!status) { //
      this.unfinishFutureOrders[d.order_id] = d;
    } else if (status === 'FINISH') {
      delete this.unfinishFutureOrders[d.order_id];
    }
  }
  async futureOrder(o = {}) {
    checkKey(o, ['pair', 'contract_type', 'lever_rate', 'side', 'direction', 'type']);
    const opt = kUtils.formatFutureOrderO(o);
    const ds = await this.post('future_trade', opt, true);
    if (ds) {
      const res = {
        success: ds ? ds.result : false,
        order_id: ds.order_id,
        time: new Date(),
        ...o
      };
      this._updateUnfinishFutureOrders(res);
      return res;
    }
    return null;
  }
  async batchFutureOrder(o = {}) {
    checkKey(o, ['pair', 'orders', 'lever_rate', 'contract_type', 'type']);
    const opt = kUtils.formatBatchFutureOrderO(o);
    const ds = await this.post('future_batch_trade', opt, true);
    const res = kUtils.formatBatchFutureOrder(ds, o);
    _.forEach(res, line => this._updateUnfinishFutureOrders(line));
    return res;
  }
  async cancelFutureOrder(o = {}) {
    const reqs = ['pair', 'order_id', 'contract_type'];
    checkKey(o, reqs);
    const opt = _.pick(o, reqs);
    const ds = await this.post('future_cancel', opt, true) || {};
    const res = { success: ds.result, order_id: ds.order_id };
    if (res.success) delete this.unfinishFutureOrders[res.order_id];
    return res;
  }
  async cancelAllFutureOrders() {
    let unfinishs = this.unfinishFutureOrders;
    if (!_.values(unfinishs).length) return { success: true, message: 'no order to cancel' };
    const reqs = ['pair', 'order_id', 'contract_type'];
    unfinishs = _.map(unfinishs, d => _.pick(d, reqs));
    unfinishs = _.groupBy(unfinishs, 'pair');
    unfinishs = _.mapValues(unfinishs, d => _.groupBy(d, 'contract_type'));
    let tasks = _.map(unfinishs, (info, pair) => {
      return _.map(info, (ds, contract_type) => {
        const o = {
          pair, contract_type, order_id: _.map(ds, d => d.order_id)
        };
        return this._cancelAllFutureOrders(o);
      });
    });
    tasks = _.flatten(tasks);
    const ds = await Promise.all(tasks);
    const res = {
      success: [],
      error: []
    };
    _.forEach(ds, (d) => {
      res.success = { ...res.success, ...d.success };
      res.error = { ...res.error, ...d.error };
    });
    return {
      success: _.keys(res.success),
      error: _.keys(res.error)
    };
  }
  async _cancelAllFutureOrders(o = {}) {
    const reqs = ['pair', 'contract_type', 'order_id'];
    checkKey(o, reqs);
    const opt = _.pick(o, reqs);
    if (Array.isArray(opt.order_id)) opt.order_id = opt.order_id.join(',');
    const ds = await this.post('future_cancel', opt, true);
    let success;
    let error;
    if (ds.result === true) {
      success = { [ds.order_id]: ds.order_id };
    } else if (ds.result === false) {
      error = { [ds.order_id]: ds.order_id };
    } else {
      error = _.keyBy(ds.error.split(','), d => d);
      success = _.keyBy(ds.success.split(','), d => d);
    }
    _.forEach(success, (suc_id) => {
      delete this.unfinishFutureOrders[suc_id];
    });
    return { success, error };
  }
  async futureOrderInfo(o = {}) {
    const reqs = ['pair', 'order_id', 'contract_type'];
    checkKey(o, reqs);
    const opt = _.pick(o, ['order_id', 'contract_type']);
    if (Array.isArray(opt.order_id)) opt.order_id = opt.order_id.join(',');
    opt.symbol = kUtils.formatPair(o.pair).replace('usdt', 'usd');
    const ds = await this.post('future_orders_info', opt, true);
    const res = kUtils.formatFutureOrderInfo(ds, o);
    this._updateUnfinishFutureOrders(res);
    return res;
  }
  async futureAllOrders(o = {}) {
    const defaultO = {
      page_length: 2000,
      current_page: 0,
      status: 'UNFINISH'
    };
    o = { ...defaultO, ...o };
    checkKey(o, ['pair']);
    const opt = kUtils.formatFutureAllOrdersO(o);
    const ds = await this.post('future_trades_history', opt, true);
    return kUtils.formatFutureAllOrders(ds);
    // future_trades_history
  }
}

module.exports = Exchange;
