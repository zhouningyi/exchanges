
const _ = require('lodash');
const md5 = require('md5');
//
const Utils = require('./../../../utils');
const publicUtils = require('./public');

const { getPairInfo, reverseOrderStatusMap, orderStatusMap, symbol2pair, pair2symbol, periodMap } = publicUtils;

function _parse(v) {
  return parseFloat(v, 10);
}

function direct(d) {
  return d;
}

function spotKlineO(o = {}) {
  const ko = {
    symbol: pair2symbol(o.pair),
    period: periodMap[o.interval],
    size: o.size || 500
  };
  return ko;
}

function spotKline(ds, o) {
  return _.map(ds, (d) => {
    return {
      unique_id: `${o.pair}${d.id}`,
      time: new Date(d.id * 1000),
      low: d.low,
      high: d.high,
      open: d.open,
      close: d.close,
      count: d.count,
      amount: d.amount,
      interval: o.interval,
      pair: o.pair
    };
  });
}

function spotTicks(ds) {
  return _.map(ds, (d) => {
    const pair = symbol2pair(d.symbol);
    if (!pair) console.log(d);
    return {
      pair,
      open: d.open,
      close: d.close,
      amount: d.amount,
      count: d.count,
    };
  });
}

function _processBalance(list) {
  const group = _.groupBy(list, l => l.currency.toUpperCase());
  const res = [];
  _.forEach(group, (arr, coin) => {
    const map = _.groupBy(arr, d => d.type);
    const locked = _.get(map.frozen, '0');
    const trade = _.get(map.trade, '0');
    const l = { coin };
    if (locked) l.locked_balance = _parse(locked.balance);
    if (trade) l.balance = _parse(trade.balance);
    // if (locked && trade) l.total_balance = l.locked_balance + l.balance;
    res.push(l);
  });
  return res;// _.filter(res, l => l.locked_balance || l.balance); 不要用
}

function pointBalances(res, o) {
  if (!res) return null;
  const { list } = res;
  return _processBalance(list);
}
function spotBalances(res, o) {
  if (!res) return null;
  const { list } = res;
  return _processBalance(list);
}

// buy-market, sell-market, buy-limit, sell-limit, buy-ioc, sell-ioc, buy-limit-maker, sell-limit-maker（
function getOrderProps(type) {
  if (type === 'buy-market') return { type: 'MARKET', side: 'BUY' };
  if (type === 'sell-market') return { type: 'MARKET', side: 'SELL' };
  if (type === 'buy-limit') return { type: 'LIMIT', side: 'BUY' };
  if (type === 'sell-limit') return { type: 'LIMIT', side: 'SELL' };
  if (type === 'buy-limit-maker') return { type: 'LIMIT', side: 'BUY', exec_type: 'maker' };
  if (type === 'sell-limit-maker') return { type: 'LIMIT', side: 'SELL', exec_type: 'maker' };
  if (type === 'buy-ioc') return { type: 'IOC', side: 'BUY' };
  if (type === 'sell-ioc') return { type: 'IOC', side: 'SELL' };
}
function getOrderType(o) {
  const type = o.type.toUpperCase();
  const side = o.side.toUpperCase();
  if (type === 'MARKET' && side === 'BUY') return 'buy-market';
  if (type === 'MARKET' && side === 'SELL') return 'sell-market';
  if (type === 'LIMIT' && side === 'BUY') return 'buy-limit';
  if (type === 'LIMIT' && side === 'SELL') return 'sell-limit';
  console.log(o, 'getOrderType: type未知...');
}
function _formatSpotOrder(l) {
  const state = l.state || l['order-state'];
  const price = state === 'canceled' ? undefined : _parse(l.price);
  const order_id = `${l.id || l['order-id']}`;
  return Utils.cleanObjectNull({
    unique_id: order_id,
    order_id,
    pair: symbol2pair(l.symbol),
    account_id: l['account-id'],
    amount: _parse(l.amount),
    price,
    server_created_at: l['created-at'] ? new Date(l['created-at']) : undefined,
    ...getOrderProps(l.type),
    server_finished_at: l['finished-at'] ? new Date(l['finished-at']) : undefined,
    server_canceled_at: l['canceled-at'] ? new Date(l['canceled-at']) : undefined,
    source: l.source,
    status: orderStatusMap[state],
    filled_amount: _parse(l['filled-amount']),
    fee: _parse(l['filled-fees']),
  });
}

// function spotLedgerO(o = {}) {
//   return { ...o };
// }

// function spotLedger(res, o = {}) {
//   const { from, to, limit, ...rest } = o;
//   return _.map(res, d => formatLedger(d, rest));
// }

function _formatPrice(price, pair) {
  const digit = _.get(getPairInfo(pair), 'base_asset_precision');
  if (digit && (price || price === 0) && price.toFixed) price = price.toFixed((digit - 1) || 4);
  return price;
}
function _formatAmount(price, pair) {
  const digit = _.get(getPairInfo(pair), 'amount_precision');
  if (digit && (price || price === 0) && price.toFixed) price = price.toFixed((digit) || 3);
  return price;
}

// // 下单
function spotOrderO(o = {}, o1) {
  const type = (o.type || 'LIMIT').toUpperCase();
  const coin = pair2symbol(o.pair);
  const opt = {
    'account-id': o1.spotId,
    symbol: coin,
    type: getOrderType(o),
    amount: o.amount,
    source: 'api'
  };
  if (o.client_oid) opt['client-order-id'] = o.client_oid;
  if (type === 'LIMIT') opt.price = _formatPrice(o.price, o.pair);
  opt.amount = _formatAmount(o.amount, o.pair);
  return opt;
}

function spotOrder(order_id, o = {}) {
  if (!order_id || order_id.error) return false;
  return { ...o, order_id };
}

// // 撤单
// function cancelOrderO(o = {}) {
//   return {
//     instrument_id: o.pair,
//     client_oid: o.client_oid,
//     order_id: o.order_id
//   };
// }

// function cancelOrder(res, o = {}) {
//   if (!res || !res.result) return false;
//   return {
//     pair: o.pair,
//     order_id: res.order_id,
//     client_oid: res.client_oid,
//     type: 'CANCEL',
//     time: new Date()
//   };
// }

// // 批量撤单
function batchCancelOpenSpotOrdersO(o = {}, o1) {
  const res = {
    'account-id': o1.spotId,
  };
  if (o.pair) res.symbol = pair2symbol(o.pair);
  return res;
}

function batchCancelOpenSpotOrders(ds) {
  console.log(ds, 'ds...');
  return {
  };
}

// // 批量撤单
function batchCancelSpotOrdersO(o = {}, o1) {
  const order_ids = _.map(o, l => l.order_id);// .join(',');
  const res = {
    'order-ids': order_ids
  };
  // if (o.pair) res.symbol = pair2symbol(o.pair);
  return res;
}

function batchCancelSpotOrders(ds) {
  if (ds.success) {
    return _.map(ds.success, (order_id) => {
      return {
        unique_id: order_id,
        order_id,
        status: 'CANCEL'
      };
    });
  }
  return false;
}

//  所有订单
function spotOrdersO(o = {}) {
  const { pair, status, type, side, ...rest } = o;
  const full = 'buy-market,sell-market,buy-limit,sell-limit,buy-ioc,sell-ioc';
  const stateFull = 'submitted,partial-filled,partial-canceled,filled,canceled';
  const types = (type && side) ? getOrderType(o) : full;
  return {
    symbol: pair2symbol(pair),
    types,
    states: status ? reverseOrderStatusMap[status] : stateFull,
  };
}
function spotOrders(res, o) {
  return _.map(res, d => _formatSpotOrder(d, o));
}
// //
function unfinishSpotOrdersO(o = {}, o1) {
  return {
    'account-id': o1.spotId,
    symbol: pair2symbol(o.pair),
  };
}

function unfinishSpotOrders(res, o) {
  return _.map(res, d => _formatSpotOrder(d, o));
}

function spotOrderInfoO(o = {}) {
  return {
    order_id: o.order_id
  };
}

function spotOrderInfo(res, o) {
  return _formatSpotOrder(res, o);
}

// //
// function orderDetailO(o = {}) {
//   return {
//     instrument_id: o.pair,
//     order_id: o.order_id
//   };
// }
// function orderDetail(res, o) {
//   return _.map(res, d => formatLedger(d, o));
// }


// function _formatTick(l) {
//   return {
//     pair: l.instrument_id,
//     bid_price: _parse(l.best_bid),
//     ask_price: _parse(l.best_ask),
//     last_price: _parse(l.last),
//     time: new Date(l.timestamp),
//   };
// }

// // depth
function _formatDepth(ds) {
  return _.map(ds, (d) => {
    return {
      price: _parse(d[0]),
      volume: _parse(d[1]),
    };
  });
}

module.exports = {
  ...publicUtils,
  // formatTick: _formatTick,
  formatDepth: _formatDepth,
  formatSpotWsOrder: _formatSpotOrder,
  processBalance: _processBalance,
  // formatOrder,
  // formatBalance: _wallet,
  // wallet,
  spotTicksO: direct,
  spotTicks,
  spotKlineO,
  spotKline,
  spotBalances,
  spotBalance: spotBalances,
  pointBalances,
  spotOrderO,
  spotOrder,
  // // order
  // spotBalancesO,
  // spotBalances,
  // spotBalance,
  // spotBalanceO,
  // spotLedgerO,
  // spotLedger,
  spotOrdersO,
  spotOrders,
  //
  unfinishSpotOrdersO,
  unfinishSpotOrders,
  // cancelOrderO,
  // cancelOrder,
  batchCancelOpenSpotOrdersO,
  batchCancelOpenSpotOrders,
  batchCancelSpotOrdersO,
  batchCancelSpotOrders,
  spotOrderInfoO,
  spotOrderInfo,
  // orderDetailO,
  // orderDetail
};
