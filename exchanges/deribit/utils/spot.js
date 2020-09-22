
const _ = require('lodash');
const md5 = require('md5');
//
const Utils = require('./../../../utils');
const publicUtils = require('./public');

const { symbol2pair, pair2symbol, intervalMap } = publicUtils;

function spotPairs(o) {
  const { symbols } = o;
  return _.map(symbols, (l) => {
    const pair = `${l.quoteAsset}-${l.baseAsset}`;
    return { ...l, pair };
  });
}

function _parse(v) {
  return parseFloat(v, 10);
}

function _formatDepth(ds) {
  return _.map(ds, (d) => {
    return {
      price: _parse(d[0]),
      volume: _parse(d[1]),
    };
  });
}

function spotDepthO(o) {
  const { pair } = o;
  const symbol = pair2symbol(pair);
  const opt = { symbol };
  if (o.limit) opt.limit = o.limit;
  return opt;
}

function spotDepth(ds) {
  return {
    exchange: 'binance',
    bids: _formatDepth(ds.bids),
    asks: _formatDepth(ds.asks)
  };
}

function spotAggTradesO(o) {
  const symbol = pair2symbol(o.pair);
  const opt = { symbol };
  if (o.time_start) opt.startTime = o.time_start;
  if (o.time_end) opt.endTime = o.time_end;
  if (o.limit) opt.limit = o.limit;
  return opt;
}
function spotAggTrades(ds) {
  return _.map(ds, (d) => {
    return {
      agg_trade_id: d.a,
      price: _parse(d.p),
      amount: _parse(d.q),
      time: new Date(d.T),
      side: d.m ? 'SELL' : 'BUY'
    };
  });
}

function spotTradesO(o) {
  const symbol = pair2symbol(o.pair);
  const opt = { symbol };
  if (o.limit) opt.limit = o.limit;
  if (o.fromId) opt.fromId = o.fromId;
  return opt;
}
function spotTrades(ds) {
  return _.map(ds, (d) => {
    return {
      order_id: d.id,
      price: _parse(d.price),
      amount: _parse(d.qty),
      time: new Date(d.time),
      side: d.isBuyerMaker ? 'BUY' : 'SELL'
    };
  });
}

function spotTicksO(o = {}) {
  const symbol = pair2symbol(o.pair);
  const opt = { symbol };
  return opt;
}

function spotTicks(d, o) {
  return {
    ...o,
    bid_price: _parse(d.bidPrice),
    ask_price: _parse(d.askPrice),
    bid_volume: _parse(d.bidQty),
    ask_volume: _parse(d.askQty)
  };
}


module.exports = {
  spotAggTradesO,
  spotAggTrades,
  spotTradesO,
  spotTrades,
  spotTicksO,
  spotTicks,
  spotPairs,
  spotDepthO,
  spotDepth
};
