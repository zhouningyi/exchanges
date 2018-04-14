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
  }
  async futureTick(o = {}) {
    const ds = await this.get('future_ticker', o);
    return kUtils.formatTick(ds);
  }

  async futureDepth(o = {}) {
    const ds = await this.get('future_depth', o);
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
      return this.futureKlines({ ...o, pair });
    });
    const dss = await Promise.all(tasks);
    // return kUtils.formatKline(ds);
  }
  async futureKline(o = {}) {
    checkKey(o, ['pair']);
    const { pair } = o;
    o = kUtils.formatFutureKlineO(o);
    const ds = await this.get('future_kline', o, true, true);
    return kUtils.formatFutureKline(ds, pair);
  }
  wsFutureTicks(o = {}, cb) {
    const { contract_type = 'quarter' } = o;
    const chanelString = kUtils.createWsChanelFutureTick(FUTURE_PAIRS, { contract_type });
    this.createWs({ timeInterval: 300, chanelString })(kUtils.formatWsFutureTick, cb);
  }
  wsFutureKlines(o = {}, cb) {
    const symbols = o.pair ? [kUtils.formatPair(o.pair, true)] : FUTURE_PAIRS;
    const { contract_type = 'quarter', interval = '1m' } = o;
    const chanelString = kUtils.createWsChanelFutureKline(symbols, { contract_type, interval });
    this.createWs({ timeInterval: 300, chanelString })(kUtils.formatWsFutureKline, cb);
  }
  wsFutureKline(o = {}, cb) {
    checkKey(o, ['pair']);
    this.wsFutureKlines(o, cb);
  }
}

module.exports = Exchange;
