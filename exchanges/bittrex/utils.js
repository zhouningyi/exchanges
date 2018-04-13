const _ = require('lodash');


const pairsMap = {};

function formatCoins(ds) {
  return _.map(ds, (d) => {
    return {
      coin_name: d.Currency,
      coin_full_name: d.CurrencyLong,
      blocks_confirmations: d.MinConfirmation,
      tx_free: d.TxFee,
      is_active: d.IsActive,
      coin_type: d.CoinType,
      base_address: d.BaseAddress,
    };
  });
}

//
function formatPairs(ds) {
  return _.map(ds, (d) => {
    const base = d.BaseCurrency;
    const quote = d.MarketCurrency;
    const pair = `${base}-${quote}`;
    pairsMap[`${base}${quote}`] = pair;
    return {
      pair,
      min_quote_amount: d.tickSize,
      is_active: d.IsActive,
      created_time: d.Created,
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

function formatTicker(d, pair) {
  return {
    pair,
    ask_price: _parse(d.Ask),
    bid_price: _parse(d.Bid),
    last_price: _parse(d.Last),
  };
}
//
function formatTickers(ds) {
  return _.map(ds, (d) => {
    const pair = formatMarket(d.MarketName);
    return {
      pair,
      last_price: _parse(d.Last),
      bid_price: _parse(d.Bid),
      ask_price: _parse(d.Ask),
      open_buy_orders: _parse(d.OpenBuyOrders),
      open_sell_orders: _parse(d.OpenSellOrders),
      high: _parse(d.High),
      low: _parse(d.Low),
      volume_24: _parse(d.Volume),
      time: new Date(d.TimeStamp)
    };
  });
}
//

function formatMarket(market) {
  return market.split('-').reverse().join('-');
}

//
function formatPairOpt(o) {
  const { pair } = o;
  if (pair) {
    delete o.pair;
    o.market = formatMarket(pair);
  }
  return o;
}

//
module.exports = {
  formatCoins, formatPairs, formatTickers, formatTicker, formatPairOpt
};
