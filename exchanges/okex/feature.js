// const Utils = require('./utils');
// const Base = require('./../base');
// const request = require('./../../utils/request');
// const crypto = require('crypto');
const _ = require('lodash');
const kUtils = require('./utils');
// const Utils = require('./../../utils');
// const md5 = require('md5');
// const error = require('./errors');
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
  async futureKline(o = {}) {
    const ds = await this.get('future_kline', o, true, true);
    return kUtils.formatOrderBook(ds);
  }
  async wsFutureTicks(o = {}, cb) {
    const { contact_type = 'quarter' } = o;
    let data = [];
    const cbf = _.throttle(() => {
      cb(data);
      data = [];
    }, 300);
    const chanelString = kUtils.createWsChanelFutureTick(FUTURE_PAIRS, { contact_type });
    const options = {
      proxy: this.proxy,
      willLink: ws => ws.send(chanelString)
    };
    kUtils.subscribe('', (ds) => {
      ds = kUtils.formatWsFeatureTick(ds);
      data = data.concat(ds);
      cbf();
    }, options);
  }
}

module.exports = Exchange;
