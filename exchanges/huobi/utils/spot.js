
const _ = require('lodash');
const md5 = require('md5');
//
const Utils = require('./../../../utils');
const publicUtils = require('./public');

const { formatOrder, formatLedger, reverseOrderStatusMap, symbol2pair, pair2symbol, periodMap } = publicUtils;

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
      low: d.low,
      high: d.high,
      open: d.open,
      close: d.close,
      count: d.count,
      amount: d.amount,
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

// function _wallet(d) {
//   return {
//     total_balance: _parse(d.balance),
//     locked_balance: _parse(d.hold),
//     balance: _parse(d.available),
//     coin: d.currency
//   };
// }
// function wallet(ds, o) {
//   let res = _.map(ds, _wallet);
//   if (o.notNull) {
//     res = _.filter(res, d => d.balance);
//   }
//   return res;
// }

// function spotBalancesO(o = {}) {
//   return o;
// }

// function spotBalances(ds, o = {}) {
//   const res = wallet(ds, o);
//   if (!o.coins) return res;
//   const coinMap = _.keyBy(o.coins, d => d);
//   return _.filter(res, d => d.coin in coinMap);
// }

// function spotBalanceO(o = {}) {
//   return o;
// }

// function spotBalance(ds, o = {}) {
//   const res = wallet([ds], o);
//   return _.get(res, 0);
// }


// function spotLedgerO(o = {}) {
//   return { ...o };
// }

// function spotLedger(res, o = {}) {
//   const { from, to, limit, ...rest } = o;
//   return _.map(res, d => formatLedger(d, rest));
// }

// // 下单
// function spotOrderO(o = {}) {
//   return {
//     ...publicUtils.orderO(o),
//     margin_trading: 1
//   };
// }

// function spotOrder(res, o = {}) {
//   if (!res || !res.result) return false;
//   return formatOrder(res, o);
// }

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
// function batchCancelSpotOrdersO(o = {}) {
//   o = _.map(_.groupBy(o, 'pair'), (l, pair) => {
//     return {
//       instrument_id: pair.toLowerCase(),
//       order_ids: _.map(l, _l => _l.order_id).slice(0, 9)
//     };
//   });
//   return o;
// }

// function batchCancelSpotOrders(ds) {
//   const res = [];
//   _.forEach(ds, (d, pair) => {
//     _.forEach(d, (_d) => {
//       res.push({
//         client_oid: _d.client_oid,
//         order_id: _d.order_id,
//         success: _d.result,
//         pair: pair.toUpperCase()
//       });
//     });
//   });
//   return res;
// }

// // 所有订单
// function spotOrdersO(o = {}) {
//   const { pair, status, ...rest } = o;
//   return {
//     instrument_id: pair,
//     status: reverseOrderStatusMap[status],
//     ...rest
//   };
// }
// function spotOrders(res, o) {
//   return _.map(res, d => formatOrder(d, o));
// }
// //
// function unfinishSpotOrdersO(o = {}) {
//   const { pair, ...rest } = o;
//   return { instrument_id: pair, ...rest };
// }

// function unfinishSpotOrders(res, o) {
//   return _.map(res, d => formatOrder(d, o));
// }

// function spotOrderInfoO(o = {}) {
//   return {
//     instrument_id: o.pair,
//     order_id: o.order_id
//   };
// }
// function spotOrderInfo(res, o) {
//   return formatOrder(res, o);
// }

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
// function _formatDepth(ds) {
//   return _.map(ds, (d) => {
//     return {
//       price: _parse(d[0]),
//       volume: _parse(d[1]),
//       count: _parse(d[2])
//     };
//   });
// }

module.exports = {
  ...publicUtils,
  // formatTick: _formatTick,
  // formatDepth: _formatDepth,
  // formatOrder,
  // formatBalance: _wallet,
  // wallet,
  spotTicksO: direct,
  spotTicks,
  spotKlineO,
  spotKline,
  // // order
  // spotBalancesO,
  // spotBalances,
  // spotBalance,
  // spotBalanceO,
  // spotLedgerO,
  // spotLedger,
  // spotOrdersO,
  // spotOrders,
  // spotOrderO,
  // spotOrder,
  // unfinishSpotOrdersO,
  // unfinishSpotOrders,
  // cancelOrderO,
  // cancelOrder,
  // batchCancelSpotOrdersO,
  // batchCancelSpotOrders,
  // spotOrderInfoO,
  // spotOrderInfo,
  // orderDetailO,
  // orderDetail
};
