const _ = require('lodash');
const Utils = require('./../../../utils');
const publicUtils = require('./public');
const md5 = require('md5');
// const moment = require('moment');
const error = require('./../errors');

const { getOrderTypeOptions, getOrderDirectionOptions, pair2symbol, asset_type2ext, parseOrderStatusOptions, parseOrderDirectionOptions, getSymbolId, parseSymbolId } = publicUtils;


const { _parse } = Utils;


function coinContractOrdersO(o = {}) {
  const { pair, asset_type } = o;
  const sb = pair2symbol(pair);
  const ext = asset_type2ext(asset_type);
  const symbol = `${sb}_${ext}`;
  const res = { symbol };
  if (o.fromId) res.fromId = o.fromId;
  if (o.limit) res.limit = o.limit;
  return res;
}

function _formatCoinContractOrder(d) {
  const { symbol: symbol_id } = d;
  const info = parseSymbolId(d);
  const res = {
    symbol_id,
    order_id: d.orderId,
    client_oid: d.clientOrderId,
    price: _parse(d.price),
    amount: _parse(d.qty || d.origQty),
    filled_amount: _parse(d.executedQty),
    fee_coin: d.commissionAsset,
    position_side: d.positionSide,
    maker: d.maker,
    time: new Date(d.time || d.updateTime),
    ...parseOrderStatusOptions(d),
    ...parseOrderDirectionOptions(d),
    ...info,
  };
  if (d.commission) res.fee = _parse(d.commission);
  if (d.price_avg) res.price_avg = _parse(d.price_avg);
  if (d.eventTime)res.event_time = new Date(d.eventTime);
  return res;
}

function coinContractOrders(ds) {
  return _.map(ds, _formatCoinContractOrder);
}

function coinContractOrderO(o = {}) {
  const opt = {
    symbol: getSymbolId(o),
    ...getOrderDirectionOptions(o),
    ...getOrderTypeOptions(o),
    quantity: o.amount
  };
  if (o.client_oid) opt.newClientOrderId = o.client_oid;
  if (o.price) opt.price = o.price;
  return opt;
}

const coinContractOrder = _formatCoinContractOrder;

function coinContractBatchCancelOrderO(o) {
  const symbol = getSymbolId(o);
  const opt = { symbol };
  if (o.order_ids)opt.orderIdList = o.order_ids;
  if (o.client_oids)opt.origClientOrderIdList = o.client_oids;
  return opt;
}
function coinContractBatchCancelOrder(ds) {
  console.log(ds, 'ds...');
}

function _formatOrderO(o) {
  const symbol = getSymbolId(o);
  const opt = { symbol };
  if (o.order_id)opt.orderId = o.order_id;
  if (o.client_oid)opt.origClientOrderId = o.client_oid;
  return opt;
}

function _formatCoinContractOrders(ds) {
  return _.map(ds, d => _formatCoinContractOrder(d));
}

const coinContractCancelOrderO = _formatOrderO;
const coinContractCancelOrder = _formatCoinContractOrder;

const coinContractOrderInfoO = _formatOrderO;
const coinContractOrderInfo = _formatCoinContractOrder;

const coinContracUnfinishedtOrdersO = _formatOrderO;
const coinContracUnfinishedtOrders = _formatCoinContractOrders;

const coinContractUnfinishedOrderHistoryO = _formatOrderO;
const coinContractUnfinishedOrderHistory = _formatCoinContractOrders;

function formatCoinContractDepth(ls) {
  return _.map(ls, l => ({ price: _parse(l[0]), volume: _parse(l[1]) }));
}

function coinContractPositionsO(o = {}) {
  return {};
}

function _formatCoinContractPosition(d) {
  const info = parseSymbolId(d);
  const res = {
    ...info,
    symbol_id: d.symbol,
    position_side: d.positionSide,
    profit_unreal: _parse(d.unrealizedProfit),
    price_avg: _parse(d.entryPrice),
    amount: _parse(d.positionAmt) || 0
  };
  if (d.leverage) res.lever_rate = _parse(d.leverage);
  if (d.maxQty) res.max_amount = _parse(d.maxQty);
  if (d.maintMargin) res.margin = _parse(d.maintMargin);
  if (d.initialMargin) res.initial_margin = _parse(d.initialMargin);
  if (d.openOrderInitialMargin)res.open_order_initial_margin = _parse(d.openOrderInitialMargin);
  if (d.positionInitialMargin) res.position_initial_margin = _parse(d.positionInitialMargin);

  return res;
}

function coinContractPositions(ds) {
  return _.map(ds.positions, _formatCoinContractPosition);
}

function coinContractPositionsRisk(ds) {
  const res = _.map(ds, (d) => {
    return {
      ...parseSymbolId(d),
      amount: _parse(d.positionAmt),
      price_avg: _parse(d.entryPrice),
      mark_price: _parse(d.markPrice),
      avaliable_balance: _parse(d.unrealizedProfit),
      max_amount: _parse(d.maxQty),
      lever_rate: _parse(d.leverage),
      liquidation_price: _parse(d.liquidationPrice),
      position_side: _parse(d.positionSide),
      margin_mode: d.marginType
    };
  });
  return res;
}

function _formatCoinContractBalance(d) {
  const res = {
    coin: d.asset,
    balance: _parse(d.balance || d.crossWalletBalance),
    cross_balance: _parse(d.crossWalletBalance),
    profit_unreal: _parse(d.crossUnPnl),
    avaliable_balance: _parse(d.availableBalance),
  };
  return res;
}

function coinContractBalances(ds) {
  return _.map(ds, _formatCoinContractBalance);
}

module.exports = {
  formatCoinContractOrder: _formatCoinContractOrder,
  formatCoinContractBalance: _formatCoinContractBalance,
  formatCoinContractPosition: _formatCoinContractPosition,
//
  coinContractPositionsO,
  coinContractPositions,
  coinContractPositionsRisk,
  formatCoinContractDepth,
  coinContractUnfinishedOrderHistoryO,
  coinContractUnfinishedOrderHistory,
  coinContracUnfinishedtOrdersO,
  coinContracUnfinishedtOrders,
  coinContractBatchCancelOrderO,
  coinContractBatchCancelOrder,
  coinContractCancelOrderO,
  coinContractCancelOrder,
  coinContractOrderInfoO,
  coinContractOrderInfo,
  coinContractOrderO,
  coinContractOrder,
  coinContractOrdersO,
  coinContractOrders,
  // coinContractPositionsRisk,
  coinContractBalances,
};
