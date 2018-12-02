
const _ = require('lodash');
const md5 = require('md5');
//
const Utils = require('./../../../utils');
const publicUtils = require('./public');

const { formatOrder, formatLedger, reverseOrderStatusMap } = publicUtils;


function direct(d) {
  return d;
}

function _parse(v) {
  return parseFloat(v, 10);
}


function wallet(ds, o) {
  let res = _.map(ds, (d) => {
    return {
      total_balance: _parse(d.balance),
      locked_balance: _parse(d.hold),
      balance: _parse(d.available),
      coin: d.currency
    };
  });
  if (o.notNull) {
    res = _.filter(res, d => d.balance);
  }
  return res;
}


function balancesO(o = {}) {
  return o;
}

function balances(ds, o = {}) {
  const res = wallet(ds, o);
  return res;
}

function spotLedgerO(o = {}) {
  return { ...o };
}

function spotLedger(res, o = {}) {
  const { from, to, limit, ...rest } = o;
  console.log(res, 'res...');
  return _.map(res, d => formatLedger(d, rest));
}

// 下单
function orderO(o = {}) {
  return {
    ...publicUtils.orderO(o),
    margin_trading: 1
  };
}

function order(res, o = {}) {
  if (!res || !res.result) return false;
  return formatOrder(res, o);
}

// 撤单
function cancelOrderO(o = {}) {
  return {
    instrument_id: o.pair,
    client_oid: o.client_oid,
    order_id: o.order_id
  };
}

function cancelOrder(res, o = {}) {
  if (!res || !res.result) return false;
  return {
    pair: o.pair,
    order_id: res.order_id,
    client_oid: res.client_oid,
    type: 'CANCEL',
    time: new Date()
  };
}

// 批量撤单
function cancelAllOrdersO(o = {}) {
  const { pair, order_ids } = o;
  if (order_ids && order_ids.length > 4) Utils.throwError('cancelAllOrdersO： 订单不超过4个');
  return _.map(order_ids, (order_id) => {
    return {
      instrument_id: pair.toLowerCase(),
      order_ids: [order_id]
    };
  });
}
function cancelAllOrders(res, o = {}) {
  console.log(res);
}

// 所有订单
function ordersO(o = {}) {
  const { pair, status, ...rest } = o;
  return {
    instrument_id: pair,
    status: reverseOrderStatusMap[status],
    ...rest
  };
}
function orders(res, o) {
  return _.map(res, d => formatOrder(d, o));
}
//
function unfinishOrdersO(o = {}) {
  const { pair, ...rest } = o;
  return { instrument_id: pair, ...rest };
}

function unfinishOrders(res, o) {
  return _.map(res, d => formatOrder(d, o));
}

function orderInfoO(o = {}) {
  console.log(o, 9999);
  return {
    instrument_id: o.pair,
    order_id: o.order_id
  };
}
function orderInfo(res, o) {
  console.log(res, 'res...res...');
  return formatOrder(res, o);
}

//
function orderDetailO(o = {}) {
  return {
    instrument_id: o.pair,
    order_id: o.order_id
  };
}
function orderDetail(res, o) {
  return _.map(res, d => formatLedger(d, o));
}

function _formatPair(l) {
  return {
    pair: l.instrument_id,
    min_amount: _parse(l.min_size), // 最小交易数量
    base_min_amount: _parse(l.base_min_size),
    tick_size: _parse(l.tick_size), //	交易价格精度
    amount_increment: _parse(l.size_increment)// 交易货币数量精度
  };
}
function pairs(res) {
  return _.map(res, _formatPair);
}

module.exports = {
  wallet,
  pairsO: direct,
  pairs,
  // order
  balancesO,
  balances,
  spotLedgerO,
  spotLedger,
  ordersO,
  orders,
  orderO,
  order,
  unfinishOrdersO,
  unfinishOrders,
  cancelOrderO,
  cancelOrder,
  cancelAllOrdersO,
  cancelAllOrders,
  orderInfoO,
  orderInfo,
  orderDetailO,
  orderDetail
};
