
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
    this.__unfinishFutureOrders = {};
  }
  // async futurePosition(o = {}) {
  //   checkKey(o, ['pair', 'contract_type']);
  //   const opt = _.pick(o, ['pair', 'contract_type']);
  //   const info = await this.post('future_position', opt, true);
  //   const ds = kUtils.formatFuturePosition(info, o);
  //   return ds;
  // }
  wsFutureDepth(o = {}, cb) {
    const symbols = o.pair ? [kUtils.pair2symbol(o.pair, true)] : FUTURE_PAIRS;
    const defaultO = {
      size: 50,
    };
    o = { ...defaultO, ...o };
    checkKey(o, ['contract_type']);
    const { contract_type, size } = o;
    const opt = { contract_type, size };
    const chanelString = kUtils.createWsFutureDepth(symbols, opt);
    const validate = (ds) => {
      if (!ds) return false;
      const line = ds[0];
      if (!line || line.channel === 'addChannel') return;
      return line.channel.startsWith('ok_sub_future') && line.channel.search('_depth_') !== -1;
    };
    this.createWs({
      chanelString,
      name: 'wsFutureDepth',
      validate,
      formater: d => kUtils.formatWsFutureDepth(d, o),
      cb
    });
  }
  wsFutureTicks(o = {}, cb) {
    const { contract_type = 'quarter' } = o;
    const pairs = o.pairs || FUTURE_PAIRS;
    const chanelString = kUtils.createWsChanelFutureTick(pairs, { contract_type });

    const validate = (ds) => {
      if (!ds) return false;
      const line = ds[0];
      if (!line || line.channel === 'addChannel') return;
      return line.channel.startsWith('ok_sub_future') && line.channel.search('_ticker_') !== -1;
    };
    this.createWs({
      chanelString,
      name: 'wsFutureTicks',
      validate,
      formater: kUtils.formatWsFutureTick,
      cb
    });
  }
  wsFutureKlines(o = {}, cb) {
    console.log('wsFutureKlines todo');
    process.exit();
    const symbols = o.pair ? [kUtils.pair2symbol(o.pair, true)] : FUTURE_PAIRS;
    const { contract_type = 'quarter', interval = '1m' } = o;
    const options = { contract_type, interval };
    const chanelString = kUtils.createWsChanelFutureKline(symbols, { contract_type, interval });
    const reconnect = () => this.wsFutureTicks(o, cb);
    this.createWs({ timeInterval: 300, chanelString, options, name: 'wsFutureKlines' })(kUtils.formatWsFutureKline, cb, reconnect);
  }
  wsFutureKline(o = {}, cb) {
    checkKey(o, ['pair']);
    this.wsFutureKlines(o, cb);
  }

  wsFuturePosition(o = {}, cb) {
    const validate = (ds) => {
      if (!ds) return false;
      const line = ds[0];
      if (!line || line.channel === 'addChannel') return;
      return line.channel === ('ok_sub_futureusd_positions');
    };

    this.createWs({
      login: true,
      chanelString: this.getLoginChanelString(),
      name: 'wsFuturePosition',
      validate,
      formater: kUtils.formatWsFuturePosition,
      cb
    });
  }
  wsFutureBalance(o = {}, cb) {
    const validate = (ds) => {
      if (!ds) return false;
      const line = ds[0];
      if (!line || line.channel === 'addChannel') return;
      return line.channel === ('ok_sub_futureusd_userinfo');
    };

    this.createWs({
      login: true,
      chanelString: this.getLoginChanelString(),
      name: 'wsFutureBalance',
      validate,
      formater: kUtils.formatWsFutureBalances,
      cb
    });
  }
  wsFutureOrder(o = {}, cb) {
    const validate = (ds) => {
      if (!ds) return false;
      const line = ds[0];
      if (!line || line.channel === 'addChannel') return;
      return line.channel === 'ok_sub_futureusd_trades';
    };

    this.createWs({
      login: true,
      chanelString: this.getLoginChanelString(),
      name: 'wsFutureOrder',
      validate,
      formater: kUtils.formatWsFutureOrder,
      cb
    });
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
      this.__unfinishFutureOrders[d.order_id] = d;
    } else if (status === 'FINISH') {
      delete this.__unfinishFutureOrders[d.order_id];
    }
  }
  async futureOrder(o = {}) {
    checkKey(o, ['pair', 'contract_type', 'lever_rate', 'side', 'direction', 'type']);
    const opt = kUtils.formatFutureOrderO(o);
    const ds = await this.post('future_trade', opt, true);
    if (ds && ds.order_id) {
      const res = {
        order_id: ds.order_id,
        success: ds.result,
        status: 'UNFINISH',
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
    const defaultO = {};
    const reqs = ['order_id', 'pair', 'contract_type'];
    checkKey(o, reqs);
    let opt = _.pick(o, reqs);
    if (Array.isArray(opt.order_id)) opt.order_id = opt.order_id.join(',');
    opt = { ...defaultO, ...opt };
    const ds = await this.post('future_cancel', opt, true) || {};
    return this._genCancelFutureResult(ds);
  }
  _genCancelFutureResult(ds) {
    const exist = d => d && d.order_id;
    const { result, order_id, success, error } = ds;
    if (order_id) {
      if (result === true) {
        delete this.__unfinishFutureOrders[order_id];
        return [{ order_id, status: 'CANCEL', result: true }];
      } else {
        return [{ order_id, result: false }];
      }
    } else {
      const errors = _.map(error.split(','), (str) => {
        if (!str) return null;
        const ids = str.split(':');
        const [id] = ids;
        return { order_id: id, status: 'UNKNOWN', result: false };
      }).filter(exist);
      const sucesses = _.map(success.split(','), (id) => {
        delete this.__unfinishFutureOrders[id];
        return { order_id: id, status: 'CANCEL', result: true };
      }).filter(exist);
      return errors.concat(sucesses);
    }
  }
  async cancelAllFutureOrders() {
    let unfinishs = this.__unfinishFutureOrders;
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
        return this.cancelFutureOrders(o);
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
  async cancelFutureOrders(o = {}) {
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
      delete this.__unfinishFutureOrders[suc_id];
    });
    return { success, error };
  }
  async unfinishedFutureOrderInfo(o = {}) { // keep_deposit
    const defaultO = {
      status: null,
      current_page: 0,
      page_length: 100
    };
    checkKey(o, ['pair', 'contract_type']);
    o = { ...defaultO, ...o, order_id: '-1' };
    opt.symbol = kUtils.pair2symbol(o.pair).replace('usdt', 'usd');
    const opt = kUtils.formatFutureOrderInfoO();
    const ds = await this.post('future_order_info', opt, true, true);
    const res = kUtils.formatFutureOrderInfo(ds, o, false);
    return res;
  }
  async successFutureOrders(o = {}) {
    checkKey(o, ['pair']);
    const ds = await this.allFutureOrders({ ...o, status: 'SUCCESS' });
    return ds;
  }
  async unfinishFutureOrders(o = {}) {
    checkKey(o, ['pair']);
    const ds = await this.allFutureOrders({ ...o, status: 'UNFINISH' });
    return ds;
  }
  async allFutureOrders(o = {}) { // 近2天来的order
    checkKey(o, ['pair', 'status']);
    const defaultO = {
      page_length: 1000,
      current_page: 0,
      order_id: -1,
    };
    const opt = kUtils.formatAllFutureOrdersO({ ...defaultO, ...o });
    let ds = await this.post('future_order_info', opt, true);
    ds = kUtils.formatFutureOrderInfo(ds, o, false);
    return ds;
  }
  async futureOrderInfo(o = {}) {
    const reqs = ['pair', 'contract_type'];
    checkKey(o, reqs);
    const defaultO = {
      current_page: 0,
      order_id: '-1'
    };
    o = { ...defaultO, ...(_.pick(o, ['order_id', 'pair', 'contract_type'])) };
    const opt = kUtils.formatFutureOrderInfoO(o);
    const ds = await this.post('future_orders_info', opt, true);
    const res = kUtils.formatFutureOrderInfo(ds, o);
    this._updateUnfinishFutureOrders(res);
    return res;
  }
  async futurePublicOrders(o = {}) {
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
