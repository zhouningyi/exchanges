const _ = require('lodash');
const Utils = require('./../../../utils');

function formatPairName(pair) {
  const pairs = pair.split('-');
  return pairs.join('').toLowerCase();
}

function formatPair(o) {
  o = _.cloneDeep(o);
  if (o.pair) o.symbol = formatPairName(o.pair);
  delete o.pair;
  return o;
}

const intervalMap = {
  '1m': '1min',
  '5m': '5min',
  '15m': '15min',
  '30m': '30min',
  '1h': '60min',
  '1d': '1day',
  '1mon': '1mon',
  '1w': '1week',
  '1y': '1year'
};

function formatKlineO(o = {}) {
  const period = intervalMap[o.interval];
  return { period, pair: o.pair, size: o.size };
}

function _parse(v) {
  return parseFloat(v, 10);
}

function formatKline(ds, o) {
  return _.map(ds, (d) => {
    return Utils.unique.kline({
      time: new Date(d.id * 1000),
      open: _parse(d.open),
      close: _parse(d.close),
      high: _parse(d.high),
      low: _parse(d.low),
      interval: o.interval,
      amount: o.amount
    });
  });
}

module.exports = {
  formatPairName,
  formatPair,
  formatKlineO,
  formatKline,
};
