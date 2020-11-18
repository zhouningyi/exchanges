const _ = require('lodash');
const Utils = require('./../../../utils');
const publicUtils = require('./public');
const md5 = require('md5');
// const moment = require('moment');
const error = require('./../errors');

const { getOrderTypeOptions, getOrderDirectionOptions, pair2symbol, asset_type2ext, parseOrderStatusOptions, parseOrderDirectionOptions, getSymbolId, parseSymbolId } = publicUtils;

const exchange = 'BINANCE';
const balance_type = 'COIN_CONTRACT';

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
  if (d.eventTime) {
    res.server_updated_at = new Date(d.eventTime);
  }
  if (d.time && !res.server_updated_at) {
    res.server_updated_at = new Date(d.time);
  }
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
  console.log(ds, 'coinContractBatchCancelOrder...');
}


function _formatCoinContractOrders(ds) {
  return _.map(ds, d => _formatCoinContractOrder(d));
}

const coinContractCancelOrderO = publicUtils.formatOrderO;
const coinContractCancelOrder = _formatCoinContractOrder;

const coinContractOrderInfoO = publicUtils.formatOrderO;
const coinContractOrderInfo = _formatCoinContractOrder;

const coinContractUnfinishOrdersO = publicUtils.formatOrderO;
const coinContractUnfinishOrders = _formatCoinContractOrders;

const coinContractUnfinishedOrderHistoryO = publicUtils.formatOrderO;
const coinContractUnfinishedOrderHistory = _formatCoinContractOrders;

const formatCoinContractDepth = publicUtils.formatDepth;

function coinContractPositionsO(o = {}) {
  return {};
}

function _formatCoinContractPosition(d) {
  const info = parseSymbolId(d);
  const res = {
    ...info,
    exchange,
    symbol_id: d.symbol,
    position_side: d.positionSide,
    price_avg: _parse(d.entryPrice),
  };
  if (d.unrealizedProfit) res.profit_unreal = _parse(d.unrealizedProfit);
  if (d.liquidationPrice) res.liquidation_price = _parse(d.liquidationPrice);
  if (d.marginType) res.margin_type = d.marginType;
  if (d.leverage) res.lever_rate = _parse(d.leverage);
  if (d.initialMargin) res.initial_margin = _parse(d.initialMargin);
  if (d.positionAmt) {
    res.vector = _parse(d.positionAmt) || 0;
    res.amount = Math.abs(res.vector);
  }
  const direction = res.vector > 0 ? 'LONG' : res.amount < 0 ? 'SHORT' : null;
  if (direction) res.direction = direction;
  if (d.maxQty) res.max_amount = _parse(d.maxQty);
  if (d.maintMargin) res.maint_margin = _parse(d.maintMargin);
  if (d.openOrderInitialMargin)res.open_order_initial_margin = _parse(d.openOrderInitialMargin);
  if (d.positionInitialMargin) res.position_initial_margin = _parse(d.positionInitialMargin);

  return res;
}

function coinContractPositions(ds) {
  return _.map(ds.positions, _formatCoinContractPosition);
}

function coinContractPositionsRisk(ds) {
  const res = _.map(ds, (d) => {
    const res = {
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
    res.instrument_id = Utils.formatter.getInstrumentId(res);
    return res;
  });
  return res;
}

function _formatCoinContractBalance(d) {
  const res = {
    balance_type,
    exchange,
    coin: d.asset,
    balance: d.balance ? _parse(d.balance) : (_parse(d.unrealizedProfit) + _parse(d.crossWalletBalance)),
    cross_balance: _parse(d.crossWalletBalance),
    profit_unreal: _parse(d.crossUnPnl),
    avaliable_balance: _parse(d.availableBalance),
  };
  res.unique_id = Utils.formatter.getBalanceId(res);
  //
  if (d.maxWithdrawAmount) res.moveable_balance = _parse(d.maxWithdrawAmount);
  if (d.openOrderInitialMargin)res.open_order_initial_margin = _parse(d.openOrderInitialMargin);
  if (d.positionInitialMargin) res.position_initial_margin = _parse(d.positionInitialMargin);
  if (d.marginBalance) res.margin = _parse(d.marginBalance);
  if (d.maintMargin) res.maint_margin = _parse(d.maintMargin);
  if (d.initialMargin) res.initial_margin = _parse(d.initialMargin);
  return res;
}

function coinContractBalances(d) {
  return (d && d.assets) ? _.map(d.assets, _formatCoinContractBalance) : { error: '返回错误' };
}


function _formatCoinContractAsset(d) {
  const res = {
    ...parseSymbolId(d),
    pair: [d.baseAsset, d.quoteAsset].join('-')
  };
  if (d.deliveryDate) res.delivery_date = new Date(d.deliveryDate);
  if (d.onboardDate) res.onboard_date = new Date(d.onboardDate);
  if (d.contractType) res.contract_type = d.contractType;
  if (d.underlyingType) res.underlyingType = d.underlyingType;
  if (d.pricePrecision) res.price_precision = d.pricePrecision;
  if (d.quantityPrecision) res.quantity_precision = d.quantityPrecision;
  return res;
}
function coinContractAssets(ds) {
  return ds ? _.map(ds.symbols, _formatCoinContractAsset) : [];
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
  coinContractUnfinishOrdersO,
  coinContractUnfinishOrders,
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
  coinContractAssets,
  coinContractBalances,
};
