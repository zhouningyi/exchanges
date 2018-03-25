const _ = require('lodash');
const Utils = require('./../../utils');
const META = require('./meta');

const { pairMap } = META;
const { floor } = Math;

// function _formatPair


function formatPair(params) {
  params = Utils.replace(params, { pair: 'symbol' });
  if (params.symbol) params.symbol = params.symbol.replace('-', '');
  return params;
}

function formatKline(ds) {
  if (!ds) return null;
  return _.map(ds, (d) => {
    return {
      open_time: new Date(d[0]),
      open: parseFloat(d[1], 10),
      high: parseFloat(d[2], 10),
      low: parseFloat(d[3], 10),
      close: parseFloat(d[4], 10),
      volume: parseFloat(d[5], 10),
      quote_asset_volume: parseFloat(d[7], 10),
      trades_count: parseInt(d[8], 10),
      taker_buy_base_asset_volume: parseInt(d[9], 10),
      taker_buy_quote_asset_volume: parseInt(d[10], 10),
    };
  });
}

//
function _parse(v) {
  return parseFloat(v, 10);
}
function _hasValue(d, key) {
  return _parse(d[key]) !== 0;
}

function formatBalances(ds) {
  if (!ds) return null;
  return _.filter(ds, (d) => {
    return _hasValue(d, 'locked') || _hasValue(d, 'free');
  }).map((d) => {
    return {
      balanceStr: d.free,
      balance: _parse(d.free),
      lockedBalanceStr: d.locked,
      lockedBalance: _parse(d.locked),
      coin: d.asset
    };
  });
}

function formatPairs(ds) {
  if (!ds) return null;
  return _.map(ds, (d) => {
    return {
      ...d,
      pair: `${d.baseAsset}-${d.quoteAsset}`
    };
  });
}

function _formatDepth(ds) {
  if (!ds) return null;
  return _.map(ds, (d) => {
    return {
      priceStr: d[0],
      price: _parse(d[0]),
      volumeStr: _parse(d[1]),
      volume: _parse(d[1])
    };
  });
}

function formatPairName(name) {
  if (!name) return null;
  return pairMap[name];
}

function formatTicks(ds) {
  if (!ds) return null;
  return _.map(ds, (d) => {
    const pair = formatPairName(d.symbol);
    if (d.symbol === '123456') return;
    if (!pair) {
      console.log(`binance的币种${d.symbol} 无法翻译为标准symbol... 请联系开发者`);
      return null;
    }
    return {
      pair,
      bidPrice: _parse(d.bidPrice),
      bidVolume: _parse(d.bidQty),
      askPrice: _parse(d.askPrice),
      askVolume: _parse(d.askQty),
    };
  }).filter(d => d);
}

function formatDepth(ds) {
  return {
    time: new Date(ds.lastUpdateId * 1000),
    bids: _formatDepth(ds.biz),
    asks: _formatDepth(ds.asks),
  };
}

function formatOrderO(o) {
  console.log(o);
}

module.exports = {
  formatPair,
  formatKline,
  formatBalances,
  formatPairs,
  formatDepth,
  formatTicks,
  formatOrderO
};
