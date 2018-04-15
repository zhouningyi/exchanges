const _ = require('lodash');
const Utils = require('./../../../utils');
const config = require('./../config');

const subscribe = Utils.ws.genSubscribe(config.WS_BASE);

function formatPair(pair, isReverse = false) {
  if (!isReverse) return pair.replace('-', '_').toLowerCase();
  return pair.split('-').reverse().join('_').toLowerCase();
}

function deFormatPair(symbol, isFuture = false) {
  let ss = symbol.split('_');
  if (isFuture) ss = ss.reverse();
  return ss.join('-').toUpperCase();
}

function _parse(v) {
  return parseFloat(v, 10);
}

function createWsChanel(genChanel) {
  return (pairs, o) => {
    const ds = _.map(pairs, (pair) => {
      const channel = genChanel(pair, o);
      return { event: 'addChannel', channel };
    });
    return JSON.stringify(ds);
  };
}

const intervalMap = {
  '1m': '1min',
  '3m': '3min',
  '15m': '15min',
  '1h': '1hour',
  '2h': '2hour',
  '4h': '4hour',
  '6h': '6hour',
  '12h': '12hour',
  '1d': '1day',
  '3d': '2hour',
};

function parseOrderType(typeStr) {
  const ts = typeStr.toUpperCase().split('_');
  const side = ts[0];
  const type = ts[1] || 'LIMIT';
  return { type, side };
}

function formatInterval(iter) {
  iter = iter.toLowerCase();
  const it = intervalMap[iter];
  if (!it) {
    console.log(`okex 的kline图没有时间周期${iter}`);
    process.exit();
  }
  return it;
}

function formatWsResult(_format) {
  let result = {};
  return (ds) => {
    _.forEach(ds, (d) => {
      const { channel } = d;
      d = d.data;
      if (d.result) return null;
      result = { ...result, ..._format(d, channel) };
    });
    return result;
  };
}

function extactPairFromFutureChannel(channel, str) {  // usd_btc_kline_quarter_1min
  const symbol = channel.replace('ok_sub_future', '').split(str)[0];
  return deFormatPair(symbol, true);
}

function extactPairFromSpotChannel(channel, str) {
  const symbol = channel.replace('ok_sub_spot_', '').split(str)[0];
  // console.log(channel, symbol, 'symbol');
  // process.exit();
  return deFormatPair(symbol, false);
}

module.exports = {
  formatInterval,
  deFormatPair,
  formatPair,
  intervalMap,
  _parse,
  //
  subscribe,
  extactPairFromFutureChannel,
  extactPairFromSpotChannel,
  formatWsResult,
  createWsChanel,
  //
  parseOrderType
};
