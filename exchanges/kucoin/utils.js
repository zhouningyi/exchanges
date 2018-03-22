const _ = require('lodash');

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
    buy: d.buy,
    sell: d.sell,
    feeRate: d.feeRate,
    trading: d.trading,
    time: new Date(d.datetime),
    volumeBuy: d.volValue,
    volumeSell: d.vol
  };
}

function formatPrices(ds) {
  return _.map(ds, _map);
}
function formatTicks(ds) {
  return _.map(ds, _map);
}


module.exports = {
  formatTime, getFilteredBalances, formatPrices, formatTicks
};
