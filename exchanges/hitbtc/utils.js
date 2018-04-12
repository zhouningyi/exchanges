const _ = require('lodash');


const pairsMap = {};

function formatCoins(ds) {
  return _.map(ds, (d) => {
    return {
      coin_name: d.id,
      coin_full_name: d.crypto,
      is_deposit: d.payinEnabled,
      is_withdraw: d.payoutEnabled,
      blocks_confirmations: d.payinConfirmations,
      transfer_enabled: d.transferEnabled,
    };
  });
}

//
function formatPairs(ds) {
  return _.map(ds, (d) => {
    const base = d.baseCurrency;
    const quote = d.quoteCurrency;
    const pair = `${base}-${quote}`;
    pairsMap[`${base}${quote}`] = pair;
    return {
      pair,
      price_filter: d.tickSize,
      buy_free: d.takeLiquidityRate,
      sell_free: d.provideLiquidityRate,
      free_currency: d.feeCurrency
    };
  });
}

function _formatPair(symbol) {
  return pairsMap[symbol];
}

//
function _parse(d) {
  return parseFloat(d, 10);
}

//
function formatTickers(ds) {
  return _.map(ds, (d) => {
    return {
      pair: _formatPair(d.symbol),
      askPrice: _parse(d.ask),
      bidPrice: _parse(d.bid),
      lastPrice: _parse(d.last),
      low: _parse(d.low),
      high: _parse(d.high),
      open: _parse(d.open),
      time: new Date(d.timestamp)
    };
  });
}

//
module.exports = {
  formatCoins, formatPairs, formatTickers
};
