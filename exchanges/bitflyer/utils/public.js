const _ = require('lodash');
const md5 = require('md5');

const Utils = require('../../../utils');
const config = require('../config');

const { checkKey } = Utils;
// const subscribe = Utils.ws.genSubscribe(config.WS_BASE);

let symbolMap;

// function _updateSymbolMap(ps) {
//   symbolMap = _.keyBy(ps, p => pair2symbol(p.pair));
// }

function _parse(v) {
  if (v === null || v === undefined) return null;
  return parseFloat(v, 10);
}

// function _formatPair(l) {
//   const { base_currency, currency } = l;
//   return {
//     pair: `${base_currency}-${currency}`,
//     ...l,
//   };
// }

// function pairs(res) {
//   const ps = _.map(res, _formatPair);
//   _updateSymbolMap(ps);
//   return ps;
// }

// function getPairInfo(pair) {
//   return symbolMap[pair2symbol(pair)];
// }

function pair2symbol(pair) {
  return pair ? pair.toLowerCase().split('-').map(transferCoin).join('_') : null;
}

function symbol2pair(symbol) {
  const ss = symbol.split('_');
  return ss.join('-').toUpperCase();
}

// function getError(d) {
//   if (d.error && d.error.length) {
//     return d.error;
//   }
//   return false;
// }

const intervalMap = {
  '1m': 'm',
  '1h': 'h',
  '1d': 'd',
};
function formatInterval(interval = '1m') {
  return intervalMap[interval];
}
function formatKline(ds) {
}


module.exports = {
  formatInterval,
  symbol2pair,
  pair2symbol,
  _parse,
};
