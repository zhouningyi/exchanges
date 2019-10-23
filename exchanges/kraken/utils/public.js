const _ = require('lodash');
const md5 = require('md5');

const Utils = require('./../../../utils');
const config = require('./../config');

const { checkKey } = Utils;
// const subscribe = Utils.ws.genSubscribe(config.WS_BASE);

let symbolMap;

function _updateSymbolMap(ps) {
  symbolMap = _.keyBy(ps, p => pair2symbol(p.pair));
}


function transferCoin(coin) {
  if (coin === 'btc') return 'xbt';
  if (coin === 'usdt') return 'usd';
  return coin;
}

function _parse(v) {
  if (v === null || v === undefined) return null;
  return parseFloat(v, 10);
}

function _formatPair(l) {
  const { wsname } = l;
  return {
    pair: wsname && wsname.replace('/', '-'),
    ...l,
  };
}

function pairs(res) {
  const ps = _.map(res.result, _formatPair);
  _updateSymbolMap(ps);
  return ps;
}

function getPairInfo(pair) {
  return symbolMap[pair2symbol(pair)];
}

function pair2symbol(pair) {
  return pair ? pair.toLowerCase().split('-').map(transferCoin).join('') : null;
}

function symbol2pair(symbol, isFuture = false) {
  let ss = symbol.split('_');
  if (isFuture) ss = ss.reverse();
  return ss.join('-').toUpperCase();
}

function getError(d) {
  if (d.error && d.error.length) {
    return d.error;
  }
  return false;
}

const intervalMap = {
  '1m': 60,
  '3m': 180,
  '5m': 300,
  '15m': 900,
  '30m': 1800,
  '1h': 3600,
  '2h': 7200,
  '4h': 14400,
  '6h': 21600,
  '12h': 43200,
  '1d': 86400,
  '1w': 604800,
};

const intervalTranslateMap = {
  '1m': 1,
  '3m': 3, // 可能没有
  '5m': 5,
  '15m': 15,
  '30m': 30,
  '1h': 60,
  '2h': 120, // 可能没有
  '4h': 240,
  '6h': 360, // 可能没有
  '12h': 720, // 可能没有
  '1d': 1440,
  '1w': 10080,
};

function formatInterval(interval) {
  if (!interval) return null;
  return intervalTranslateMap[interval];
}


module.exports = {
  getError,
  formatInterval,
  symbol2pair,
  pair2symbol,
  _parse,
  getPairInfo,
  pairs,
};
