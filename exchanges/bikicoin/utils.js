
const _ = require('lodash');
let allPairs = require('./meta/pairs.json');
const Utils = require('./../../utils');

const exchange = 'bikicoin';

const { parse } = Utils;

let symbolMap = _.keyBy(allPairs, d => pair2symbol(d.pair));
updateSymbolMap();

function updateSymbolMap() {
  symbolMap = _.keyBy(allPairs, d => pair2symbol(d.pair));
}

function pair2symbol(pair) {
  return pair.split('-').join('').toLowerCase();
}

function _formatO(o) {
  o = _.cloneDeep(o);
  if (o.pair) o.symbol = pair2symbol(o.pair);
  delete o.pair;
  return o;
}

function formatPair(line) {
  const { pair } = line;
  if (pair) {
    line = _.cloneDeep(line);
    line.symbol = pair2symbol(line.pair);
  }
  return line;
}

function symbol2pair(symbol) {
  symbol = symbol.toLowerCase();
  const line = symbolMap[symbol];
  if (!line) return console.log(`no pair: ${symbol}`);
  return line.pair;
}

// /

function formatPairs(ds) {
  allPairs = _.map(ds, (d) => {
    return {
      symbol: d.symbol.toLowerCase(),
      quote_asset_precision: d.quoteAssetPrecision,
      base_asset_precision: d.baseAssetPrecision,
      pair: `${d.baseAsset}-${d.quoteAsset}`
    };
  });
  updateSymbolMap();
  return allPairs;
}

function formatTicks(ds) {
  const { timestamp, ticker } = ds;
  return _.map(ticker, (d) => {
    return {
      pair: symbol2pair(d.symbol),
      last_price: parse(d.last),
      bid_price: parse(d.buy),
      ask_price: parse(d.sell),
      time: new Date(timestamp)
    };
  });
}

function formatDepthO(o) {
  const symbol = pair2symbol(o.pair);
  return {
    size: o.size,
    symbol
  };
}

function _formatDepth(ds) {
  return _.map(ds, (d) => {
    return {
      price: parse(d[0]),
      volume: parse(d[1])
    };
  });
}

function formatDepth(ds, o) {
  const { asks, bids } = ds;
  return {
    pair: o.pair,
    time: new Date(),
    exchange,
    asks: _formatDepth(asks),
    bids: _formatDepth(bids),
  };
}

function formatBalances(ds, o = {}) {
  const { coin_list } = ds;
  return _.map(coin_list, (line) => {
    const balance = parse(line.normal);
    const locked_balance = parse(line.locked);
    return {
      coin: line.coin.toUpperCase(),
      balance,
      locked_balance
    };
  });
}
//
const tradeTypeMap = {
  limit: 1,
  market: 2
};

const reverseTradeTypeMap = {
  1: 'LIMIT',
  2: 'MARKET'
};

function _fixVol(vol, pair) {
  const symbol = pair2symbol(pair);
  const info = symbolMap[symbol];
  const { base_asset_precision } = info;
  return vol.toFixed(base_asset_precision);
}

function formatOrderO(o = {}) {
  const type = o.type.toLowerCase();
  return {
    symbol: pair2symbol(o.pair),
    type: tradeTypeMap[type],
    volume: _fixVol(o.amount, o.pair),
    price: o.price.toFixed(8),
    side: o.side
  };
}
function formatOrder(ds, o) {
  const { order_id } = ds;
  return {
    pair: o.pair,
    type: o.type,
    side: o.side,
    price: o.price,
    amount: o.amount,
    status: 'UNFINISH',
    time: new Date(),
    order_id: `${order_id}`
  };
}
//

function formatTradesO(o = {}) {
  return _formatO(o);
}
function formatOrdersO(o) {
  return _formatO(o);
}

// const statusMap = {
//   submitted: 'UNFINISH',
//   partial_filled:	'UNFINISH',
//   partial_canceled:	'CANCEL',
//   filled: 'FINISH',
//   canceled:	'CANCEL',
//   // pending_cancel: 'CANCELLING',
// };

const reverseStatusMap = {
  1: 'UNFINISH',
  2: 'FINISH',
  4: 'CANCEL'
};

function formatOrders(res = {}, o = {}) {
  const { orderList } = res;
  const { pair } = o;
  return _.map(orderList, (l) => {
    const status = reverseStatusMap[l.status];
    if (!status) console.log('no status', l.status, l.status_msg);
    return {
      order_id: `${l.id}`,
      pair,
      side: l.side,
      time: new Date(l.created_at),
      type: reverseTradeTypeMap[l.type],
      amount: parse(l.volume),
      deal_amount: parse(l.deal_volume),
      price: parse(l.price),
      status
    };
  });
}

// cancel order
function formatCancelOrderO(o) {
  return _formatO(o);
}
//
function formatCancelOrder(ds, o) {
  const res = { pair: o.pair };
  if (ds.msg === 'suc') res.status === 'CANCEL';
  return res;
}
//
function formatActiveOrdersO(o) {
  return _formatO(o);
}
function formatActiveOrders(ds, o) {
  const { resultList } = ds;
  return _.map(resultList, (d) => {
    return {
      order_id: `${d.id}`,
      pair: o.pair,
      status: reverseStatusMap[d.status],
      time: new Date(d.created_at),
      side: d.side,
      price: parse(d.total_price),
      type: reverseTradeTypeMap[d.type],
      deal_amount: parse(d.deal_volume),
      amount: parse(d.volume),
    };
  });
}
// cancelAllOrders
function formatCancelAllOrdersO(o) {
  return _formatO(o);
}
function formatCancelAllOrders(ds = {}, o = {}) {
  const { msg } = ds;
  if (msg === 'suc') return [];
  return false;
}

// orderInfo
function formatOrderInfoO(o = {}) {
  return _formatO(o);
}
function formatOrderInfo(ds, o = {}) {
  if (!ds) return false;
  const d = ds.order_info;
  return {
    pair: o.pair,
    order_id: `${d.id}`,
    status: reverseStatusMap[d.status],
    time: new Date(d.created_at),
    side: d.side,
    price: parse(d.price),
    type: reverseTradeTypeMap[d.type],
    deal_amount: parse(d.deal_volume),
    amount: parse(d.volume),
  };
}
module.exports = {
  formatPairs,
  formatTicks,
  formatDepthO,
  formatDepth,
  formatBalances,
  formatTradesO,
  formatOrderO,
  formatOrder,
  formatOrdersO,
  formatOrders,
  formatCancelOrderO,
  formatCancelOrder,
  formatActiveOrdersO,
  formatActiveOrders,
  formatCancelAllOrdersO,
  formatCancelAllOrders,
  formatOrderInfoO,
  formatOrderInfo,
  //
  formatPair,
  symbol2pair,
  pair2symbol
};
