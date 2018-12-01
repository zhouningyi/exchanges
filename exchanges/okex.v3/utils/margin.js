
const _ = require('lodash');
// const md5 = require('md5');
//
const Utils = require('./../../../utils');
const { orderStatusMap, formatOrder, orderO } = require('./public');

const reverseOrderStatusMap = _.invert(orderStatusMap);
const { checkKey } = Utils;


function direct(d) {
  return d;
}

function _parse(v) {
  return parseFloat(v, 10);
}

function symbol2pair(symbol) {
  return symbol.replace('_', '-');
}

function _parseBalance(d) {
  return {
    balance: _parse(d.available),
    borrow_balance: _parse(d.borrowed),
    total_balance: _parse(d.balance),
    locked_balance: _parse(d.hold),
    fee: _parse(d.lending_fee)
  };
}

function coin2currency(coin) {
  return `currency:${coin}`;
}

function marginBalance(ds, o) {
  const res = [];
  _.forEach(ds, (d) => {
    const pair = symbol2pair(d.instrument_id);
    const [left, right] = pair.split('-');
    const leftInfo = d[coin2currency(left)];
    const rightInfo = d[coin2currency(right)];
    const pub = {
      pair,
      liquidation_price: _parse(d.liquidation_price),
      risk_rate: _parse(d.risk_rate),
    };
    res.push({
      ...pub,
      unique_id: `${pair}_${left}`,
      coin: left,
      ..._parseBalance(leftInfo)
    });
    res.push({
      ...pub,
      unique_id: `${pair}_${right}`,
      coin: right,
      ..._parseBalance(rightInfo)
    });
  });
  if (o && o.notNull) {
    return _.filter(res, d => d.balance || d.total_balance);
  }
  return res;
}


function _parseMarginCoin(d) {
  return {
    fee_rate: _parse(d.rate),
    lever_rate: _parse(d.leverage)
  };
}

function marginCoins(ds) {
  const res = [];
  _.forEach(ds, (d) => {
    const pair = symbol2pair(d.instrument_id);
    const [left, right] = pair.split('-');
    const leftInfo = d[coin2currency(left)];
    const rightInfo = d[coin2currency(right)];
    const pub = { pair };
    res.push({
      ...pub,
      unique_id: `${pair}_${left}`,
      coin: left,
      ..._parseMarginCoin(leftInfo)
    });
    res.push({
      ...pub,
      coin: right,
      unique_id: `${pair}_${right}`,
      ..._parseMarginCoin(rightInfo)
    });
  });
  return res;
}

// 借款历史
const marginStatus = {
  brrowing: 0,
  payoff: 1,
};

function borrowHistoryO(o = {}) {
  const opt = _.cloneDeep(o);
  if (o.status) {
    opt.status = marginStatus[o.status];
  }
  return opt;
}

function _borrowHistory(d, o) {
  return {
    status: o.status,
    amount: _parse(d.amount),
    order_id: d.borrow_id,
    time: new Date(d.created_at),
    coin: d.currency,
    instrument_id: d.instrument_id,
    interest: _parse(d.interest),
    repayed_amount: _parse(d.returned_amount),
    repayed_interest: _parse(d.paid_interest),
    last_interest_time: new Date(d.last_interest_time)
  };
}

function borrowHistory(ds, o) {
  return _.map(ds, d => _borrowHistory(d, o));
}

// 借款
function borrowO(o) {
  return {
    instrument_id: o.instrument_id,
    currency: o.coin,
    amount: o.amount
  };
}

function borrow(d) {
  if (!d) return false;
  return {
    order_id: d.borrow_id,
    success: d.result
  };
}

function repayO(o) {
  return {
    client_oid: o.client_oid,
    borrow_id: o.order_id,
    instrument_id: o.instrument_id,
    amount: o.amount,
    currency: o.coin
  };
}

function repay(d) {
  if (!d) return false;
  return {
    order_id: d.repayment_id,
    success: d.result
  };
}

// 下单
function marginOrderO(o) {
  const opt = { ...orderO, margin_trading: 2 };
  return opt;
}
function marginOrder(d, o) {
  if (!d) return false;
  return formatOrder(d, o);
}

function cancelMarginOrderO(o = {}) {
  return {
    instrument_id: o.instrument_id,
    client_oid: o.client_oid
  };
}

function cancelMarginOrder(d, o) {
  const res = {
    order_id: d.order_id,
    client_oid: d.client_oid,
    ...o
  };
  if (d.result) res.status = 'CANCEL';
  return res;
}

function _formatOrderIds(ids) {
  if (Array.isArray(ids)) return ids.join(',');
}
function cancelAllMarginOrdersO(o = {}) {
  return { ...o };
  // return { instrument_id: o.instrument_id, order_id: _formatOrderIds(o.order_ids) };
}
function cancelAllMarginOrders(ds, o) {
  console.log(ds);
  return ds;
}


function marginOrdersO(o = {}) {
  return {
    instrument_id: o.instrument_id,
    status: reverseOrderStatusMap[o.status],
    from: o.from,
    to: o.to,
    limit: o.limit
  };
}


function _marginOrders(d, o) {
  return {
    ...formatOrder(d),
    ...o
  };
}

function unfinishMarginOrdersO(o = {}) {
  return {
    ...o
  };
}

function unfinishMarginOrders(ds, o) {
  return _.map(ds, d => formatOrder(d, o));
}

// function successMarginOrders() {
// }
// function successMarginOrdersO(o = {}) {
// }
function marginOrders(ds) {
  return _.map(ds, _marginOrders);
}

function marginOrderInfoO(o = {}) {
  return o;
}

function marginOrderInfo(line, o) {
  return { ...formatOrder(line), ...o };
}

module.exports = {
  marginBalance,
  marginBalanceO: direct,
  marginCoinsO: direct,
  marginCoins,
  borrowHistoryO,
  borrowHistory,
  borrow,
  borrowO,
  repay,
  repayO,
  marginOrderO,
  marginOrder,
  cancelAllMarginOrdersO,
  cancelAllMarginOrders,
  cancelMarginOrderO,
  cancelMarginOrder,
  marginOrdersO,
  marginOrders,
  unfinishMarginOrdersO,
  unfinishMarginOrders,
  marginOrderInfoO,
  marginOrderInfo
};
