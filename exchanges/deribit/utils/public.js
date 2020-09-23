const _ = require('lodash');
const md5 = require('md5');

const Utils = require('./../../../utils');
const meta = require('./../../../utils/meta');

const config = require('./../config');

const { checkKey } = Utils;
// const subscribe = Utils.ws.genSubscribe(config.WS_BASE);

function pair2symbol(pair, isReverse = false) {
  if (!isReverse) return pair.replace('-', '').toUpperCase();
  return pair.split('-').reverse().join('').toUpperCase();
}

function symbol2pair(symbol, isFuture = false) {
  let ss = symbol.split('_');
  if (isFuture) ss = ss.reverse();
  return ss.join('-').toUpperCase();
}

function time(o) {
  return {
    time: new Date(o.serverTime),
    timestamp: o.serverTime
  };
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

// const futureOrderStatus2Code = _.invert(code2FutureOrderStatus);

function pair2coin(pair) {
  return pair.split('-')[0].toUpperCase();
}

function coin2pair(coin, baseCoin = 'USDT') {
  return (`${coin}-${baseCoin}`).toUpperCase();
}


function usdtContractPairsO(o = {}) {
  return {};
}
function usdtContractPairs(ds) {
  return _.map(ds.symbols, (d) => {
    return {
      pair: `${d.baseAsset}-${d.quoteAsset}`,
      ...d
    };
  });
}

module.exports = {
  usdtContractPairsO,
  usdtContractPairs,
  pair2coin,
  coin2pair,
  symbol2pair,
  pair2symbol,
  intervalMap,
  time
};
