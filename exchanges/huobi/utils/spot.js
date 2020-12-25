
const _ = require('lodash');
const md5 = require('md5');
//
const Utils = require('./../../../utils');
const ef = require('./../../../utils/formatter');
const publicUtils = require('./public');

const { getPairInfo, systemStatusMap, checkKey, reverseOrderStatusMap, orderStatusMap, symbol2pair, pair2symbol, formatCoin, periodMap } = publicUtils;

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
  return ef.mapResult(ds, (d) => {
    return {
      unique_id: `${o.pair}${d.id}`,
      time: new Date(d.id * 1000),
      low: d.low,
      high: d.high,
      open: d.open,
      close: d.close,
      count: d.count,
      volume: d.amount,
      base_volume: d.vol,
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

const exchange = 'HUOBI';
function _processBalance(list) {
  const group = _.groupBy(list, l => formatCoin(l.currency));
  const res = [];
  _.forEach(group, (arr, coin) => {
    const map = _.groupBy(arr, d => d.type);
    const locked = _.get(map.frozen, '0');
    const trade = _.get(map.trade, '0');
    const l = { coin, exchange };
    if (locked) l.locked_balance = _parse(locked.balance);
    if (trade) l.balance = _parse(trade.balance);
    l.asset_type = 'SPOT';
    l.balance_id = Utils.formatter.getBalanceId(l);
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
function getOrderProps({ type, exec_type }) {
  let res = {};
  if (type === 'buy-market') res = { type: 'MARKET', side: 'BUY' };
  if (type === 'sell-market') res = { type: 'MARKET', side: 'SELL' };
  if (type === 'buy-limit') res = { type: 'LIMIT', side: 'BUY' };
  if (type === 'sell-limit') res = { type: 'LIMIT', side: 'SELL' };
  if (type === 'buy-limit-maker') res = { type: 'LIMIT', side: 'BUY', order_type: 'POST_ONLY' };
  if (type === 'sell-limit-maker') res = { type: 'LIMIT', side: 'SELL', order_type: 'POST_ONLY' };
  if (type === 'buy-ioc') res = { type: 'IOC', side: 'BUY' };
  if (type === 'sell-ioc') res = { type: 'IOC', side: 'SELL' };
  if (exec_type === 'marker') {
    res.order_type = 'POST_ONLY';
  } else if (exec_type === 'fok') {
    res.order_type = 'FOK';
  }
  return res;
}
function getOrderType(o) {
  const type = o.type.toUpperCase();
  const side = o.side.toUpperCase();
  const order_type = (o.order_type || '').toUpperCase();
  let res = null;
  if (type === 'MARKET' && side === 'BUY') res = 'buy-market';
  if (type === 'MARKET' && side === 'SELL') res = 'sell-market';
  if (type === 'LIMIT' && side === 'BUY') res = 'buy-limit';
  if (type === 'LIMIT' && side === 'SELL') res = 'sell-limit';
  let addon = '';
  if (['POST_ONLY', 'MAKER'].includes(order_type)) addon = 'maker';
  if (['FOK'].includes(order_type)) addon = 'fok';
  if (['IOC'].includes(order_type) && res) res = res.replace('-limit', '-ioc');
  res = [res, addon].filter(d => d).join('-');
  if (!res)console.log(o, 'getOrderType: type未知...');
  return res;
}

function _formatSpotOrder(l) {
  const state = l.state || l['order-state'];
  const price = state === 'canceled' ? undefined : _parse(l.price);
  const order_id = `${l.id || l['order-id']}`;
  if (l.error) return null;
  const res = {
    unique_id: order_id,
    exchange,
    asset_type: 'SPOT',
    order_id,
    pair: symbol2pair(l.symbol),
    account_id: l['account-id'],
    amount: _parse(l.amount),
    price,
    server_created_at: l['created-at'] ? new Date(l['created-at']) : undefined,
    ...getOrderProps(l),
    server_updated_at: l['finished-at'] ? new Date(l['finished-at']) : new Date(),
    server_canceled_at: l['canceled-at'] ? new Date(l['canceled-at']) : undefined,
    source: l.source,
    status: orderStatusMap[state],
    filled_amount: _parse(l['filled-amount'] || l['field-amount']),
    fee: _parse(l['filled-fees'] || l['field-fees']),
  };
  if (l['client-order-id']) {
    res.client_oid = `${l['client-order-id']}`;
  } else {
    console.log(l, 9991);
  }
  return Utils.cleanObjectNull(res);
}

// function spotLedgerO(o = {}) {
//   return { ...o };
// }

// function spotLedger(res, o = {}) {
//   const { from, to, limit, ...rest } = o;
//   return _.map(res, d => formatLedger(d, rest));
// }

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
  if (type === 'LIMIT') opt.price = `${o.price}`;
  return opt;
}

function spotOrder(order_id, o = {}) {
  if (!order_id || order_id.error) return false;
  return { ...o, asset_type: 'SPOT', order_id };
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
function spotUnfinishOrdersO(o = {}, o1) {
  return {
    'account-id': o1.spotId,
    symbol: pair2symbol(o.pair),
  };
}

function spotUnfinishOrders(res, o) {
  return _.map(res, d => _formatSpotOrder(d, o));
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

// /

function spotSystemStatus(d) {
  if (!d) return { error: 'systemStatus没数据..' };
  const interval = 5 * 60 * 1000;
  const now = new Date().getTime();
  return _.map(d.scheduled_maintenances, (d) => {
    return {
      title: d.name,
      status: systemStatusMap[d.status],
      time_start: new Date(d.scheduled_for),
      time_end: new Date(d.scheduled_end)
    };
  }).concat(_.map(d.components, (d) => {
    if (['operational', 'degraded_performance'].includes(d.status)) return null;
    return {
      title: d.name,
      statusName: d.status,
      status: 'ING',
      time_start: new Date(now - interval),
      time_end: new Date(now - interval)
    };
  })).filter(d => d);
}
const asset_type = 'SPOT';
function spotAssets(ds) {
  if (!ds) return null;
  return _.map(ds, (d) => {
    const pair = [d['base-currency'], d['quote-currency']].join('-').toUpperCase();
    const res = {
      exchange,
      pair,
      asset_type,
      price_precision: d['price-precision'],
      amount_precision: d['amount-precision'],
      base_precision: d['amount-precision'],
      lever_rate: _parse(d['leverage-ratio']),
      isable: d.state === 'online'
    };
    res.instrument_id = Utils.formatter.getInstrumentId(res);
    return res;
  });
}


// 按照order_id撤销订单
function spotCancelOrderByOrderIdO(o) {
  return { order_id: o.order_id };
}
function spotCancelOrderByOrderId(order_id, o) {
  return (order_id && !order_id.error) ? { ...o, order_id, status: 'CANCELING' } : null;
}

// 按照client_oid撤销订单
function spotCancelOrderByClientOrderIdO(d) {
  return { 'client-order-id': d.client_oid };
}
function spotCancelOrderByClientOrderId(statusId, o) {
  if (statusId && !statusId.error) return { ...o, status: orderStatusMap[statusId] };
  return statusId;
}

const spotOrderInfoByOrderIdO = o => ({ order_id: o.order_id });
const spotOrderInfoByOrderId = (d) => {
  return _formatSpotOrder(d);
};

function spotOrderInfoByClientOrderIdO(o) {
  return { clientOrderId: o.client_oid };
}
const spotOrderInfoByClientOrderId = (d) => {
  return _formatSpotOrder(d);
};

// 查询借币利息及额度
function spotInterestO(o) {
  const { exchange, asset_type, symbols } = o;
  const res = { exchange, asset_type, symbols };
  if (o.timeStart) res.start = o.timeStart.toISOString();
  if (o.timeEnd) res.end = o.timeEnd.toISOString();
  return res;
}
function _formatInterest(d, o) {
  // console.log(d,'fatch-----> data')
  const exchange = 'HUOBI';
  const asset_type = 'SPOT';
  // const time = new Date();
  // const pair = d.isolatedSymbol;
  // const unique_id = `${exchange}_${asset_type}_${pair}`;
  return d;
  // return {
  //   time,
  //   unique_id,
  //   exchange,
  //   asset_type,
  //   interest: _parse(d.interest),
  //   interest_rate: _parse(d.interestRate),
  //   type: d.type,
  //   pair,
  //   principal:_parse(d.principal)
  // };
}
function spotInterest(ds, o) {
  return _.map(ds, l => _formatInterest(l, o));
}
module.exports = {
  spotOrderInfoByOrderIdO,
  spotOrderInfoByOrderId,
  spotOrderInfoByClientOrderIdO,
  spotOrderInfoByClientOrderId,
  spotCancelOrderByClientOrderIdO,
  spotCancelOrderByClientOrderId,
  spotCancelOrderByOrderIdO,
  spotCancelOrderByOrderId,
  // spotMoveBalanceO,
  // spotMoveBalance,
  spotAssets,
  spotSystemStatus,
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
  getSpotOrderProps: getOrderProps,
  //
  spotUnfinishOrdersO,
  spotUnfinishOrders,
  // cancelOrderO,
  // cancelOrder,
  batchCancelOpenSpotOrdersO,
  batchCancelOpenSpotOrders,
  batchCancelSpotOrdersO,
  batchCancelSpotOrders,
  // orderDetailO,
  // orderDetail,
  spotInterestO,
  spotInterest
};


// function formatDigit(num, n) {
//   const k = Math.pow(10, n);
//   return Math.floor(num * k) / k;
// }
// function spotMoveBalanceO(o = {}) {
//   const { source, target, coin, instrument_id, sub_account } = o;
//   if (source === 'sub_account') checkKey(o, ['sub_account']);
//   if (source === 'margin') checkKey(o, ['instrument_id']);
//   const amount = formatDigit(o.amount, 4);// 有时候会有精度问题
//   const from = accountTypeMap[source];
//   if (!from) {
//     console.log(`source: ${source}错误，找不到相应的错误码`);
//     return false;
//   }
//   const to = accountTypeMap[target];
//   if (!to) {
//     console.log(`target: ${target}错误，找不到相应的错误码`);
//     return false;
//   }
//   const currency = coin;// .toLowerCase();
//   const opt = { from, to, currency, instrument_id, sub_account, amount };
//   return opt;
// }
// function spotMoveBalance(res, o = {}) {
//   const success = res.result === true;
//   const error = res.result === true ? null : res.result || res.message;
//   return {
//     trx_id: res.transfer_id,
//     coin: o.coin,
//     source: o.source,
//     target: o.target,
//     amount: res.amount || o.amount,
//     success,
//     error
//   };
// }
