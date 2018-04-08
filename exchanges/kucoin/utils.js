const _ = require('lodash');
const { coinMap } = require('./meta');
const Utils = require('./../../utils');

const { floor } = Math;
function formatTime(o) {
  return {
    ...o,
    startTime: o.startTime ? floor(o.startTime / 1000) : null,
    endTime: o.endTime ? floor(o.endTime / 1000) : null,
  };
}

function getFilteredBalances(ds) {
  ds = _.filter(ds, d => d.balance !== 0);
  return _.map(ds, (d) => {
    return {
      balanceStr: d.balanceStr,
      balance: d.balance,
      coin: d.coinType,
      lockedBalanceStr: d.freezeBalanceStr,
      lockedBalance: d.freezeBalance
    };
  });
}

function _map(d) {
  return {
    pair: d.symbol,
    bidPrice: d.buy,
    askPrice: d.sell,
    feeRate: d.feeRate,
    trading: d.trading,
    time: new Date(d.datetime),
    bidVolume24: d.volValue,
    askVolume24: d.vol
  };
}

function formatPrices(ds) {
  return _.map(ds, _map).filter(d => d.trading);
}
function formatTicks(ds) {
  return _.map(ds, _map).filter(d => d.trading);
}

function formatOrderO(o) {
  const coinInfo = coinMap[o.pair.split('-')[0]];
  const { tradePrecision } = coinInfo;
  o.amount = o.amount.toFixed(tradePrecision);
  if (o.type) o.type = o.type.toUpperCase();
  o = Utils.replace(o, { side: 'type' });
  return o;
}

module.exports = {
  formatTime, getFilteredBalances, formatPrices, formatTicks, formatOrderO
};
