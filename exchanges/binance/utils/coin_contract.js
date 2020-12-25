const _ = require('lodash');
const Utils = require('./../../../utils');
const publicUtils = require('./public');
const md5 = require('md5');
// const moment = require('moment');
const error = require('./../errors');
const ef = require('./../../../utils/formatter');
const { cleanObjectNull } = require('./../../../utils');

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

function _formatCoinContractOrder(d, o = {}) {
  const { symbol: symbol_id } = d;
  const { assets, ...rest } = o;
  const info = parseSymbolId(d);
  const res = {
    ...rest,
    exchange,
    ...parseOrderStatusOptions(d),
    ...parseOrderDirectionOptions(d),
    ...info,
  };
  if (symbol_id)res.symbol_id = symbol_id;
  if (d.orderId)res.order_id = `${d.orderId}`;
  if (d.clientOrderId)res.client_oid = `${d.clientOrderId}`;
  if (d.time || d.updateTime) res.time = new Date(d.time || d.updateTime);
  if (d.maker || d.maker === false)res.maker = d.maker;
  if (d.price) res.price = _parse(d.price);
  if (d.positionSide) res.position_side = d.positionSide;
  if (d.commissionAsset) res.fee_coin = d.commissionAsset;
  if (d.executedQty)res.filled_amount = _parse(d.executedQty);
  if (d.qty || d.origQty) res.amount = _parse(d.qty || d.origQty);
  if (d.commission) res.fee = _parse(d.commission);
  if (d.price_avg) res.price_avg = _parse(d.price_avg);
  if (d.eventTime) {
    res.server_updated_at = new Date(d.eventTime);
  }
  if (d.time && !res.server_updated_at) {
    res.server_updated_at = new Date(d.time);
  }
  return cleanObjectNull(res);
}

function coinContractOrders(ds) {
  return _.map(ds, _formatCoinContractOrder);
}

function coinContractOrderO(o = {}) {
  const opt = {
    symbol: getSymbolId(o),
    newOrderRespType: 'ACK',
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
  } else if (d.entryPrice && d.leverage && d.initialMargin) {
    // const amount = _parse(d.entryPrice) * _parse(d.initialMargin) * _parse(d.leverage);
    // res.vector = amount || 0;
    // res.amount = Math.abs(res.vector);
  } else {
    console.log('_formatCoinContractPosition/position 数据错误....');
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
      exchange,
      ...parseSymbolId(d),
      amount: _parse(d.positionAmt),
      price_avg: _parse(d.entryPrice),
      mark_price: _parse(d.markPrice),
      avaliable_balance: _parse(d.unrealizedProfit),
      max_amount: _parse(d.maxQty),
      lever_rate: _parse(d.leverage),
      liquidation_price: _parse(d.liquidationPrice),
      position_side: d.positionSide,
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
  res.balance_id = Utils.formatter.getBalanceId(res);
  //
  if (d.maxWithdrawAmount) res.withdraw_available = _parse(d.maxWithdrawAmount);
  if (d.openOrderInitialMargin)res.open_order_initial_margin = _parse(d.openOrderInitialMargin);
  if (d.positionInitialMargin) res.position_initial_margin = _parse(d.positionInitialMargin);
  if (d.marginBalance) res.margin = _parse(d.marginBalance);
  if (d.maintMargin) res.maint_margin = _parse(d.maintMargin);
  if (d.initialMargin) res.initial_margin = _parse(d.initialMargin);
  return res;
}

function coinContractBalancesO(d) {
  return {};
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
  if (d.quantityPrecision) res.amount_precision = d.quantityPrecision;
  return res;
}

function coinContractAssets(ds) {
  return ds ? _.map(ds.symbols, _formatCoinContractAsset) : [];
}

const ledgerTypeMap = {
  [ef.ledgerTypes.TRANSFER]: 'TRANSFER',
  [ef.ledgerTypes.FEE]: 'COMMISSION',
  [ef.ledgerTypes.FUNDING_RATE]: 'FUNDING_FEE'
};
const reverseLedgerTypeMap = _.invert(ledgerTypeMap);

function coinContractLedgersO(o) {
  const { type } = o;
  const opt = {};
  if (type) opt.incomeType = ledgerTypeMap[type];
  return opt;
}
function coinContractLedgers(ds) {
  return _.map(ds, (d) => {
    return {
      ...parseSymbolId(d),
      type: reverseLedgerTypeMap[d.incomeType],
      balance: _parse(d.income),
      coin: d.asset,
      time: new Date(d.time),
    };
  }).filter(d => d);
}


const coinContractOrderDetailsO = (o) => {
  if (o.pair && o.asset_type) return coinContractOrdersO(o);
  return { pair: o.pair };
};

function _formatCoinContractOrderDetail(d) {
  return {
    unique_id: `${exchange}_${d.id}`,
    ...parseSymbolId(d),
    order_id: `${d.orderId}`,
    side: d.side,
    amount: _parse(d.qty),
    margin_asset: d.marginAsset,
    fee: _parse(d.commission),
    fee_coin: d.commissionAsset,
    time: new Date(d.time),
    position_side: d.positionSide,
    exec_type: d.maker ? 'MAKER' : 'TAKER',
    buyer: d.buyer
  };
}
function coinContractOrderDetails(ds) {
  return _.map(ds, _formatCoinContractOrderDetail);
}

function coinContractUpdateLeverateO(o = {}) {
  return {
    symbol: getSymbolId(o),
    leverage: o.lever_rate,
  };
}
function coinContractUpdateLeverate(res, o) {
  if (res && res.leverage) return { ...o, lever_rate: res.leverage };
  return null;
}

function empty() {
  return {};
}

module.exports = {
  coinContractUpdateLeverateO,
  coinContractUpdateLeverate,
  coinContractOrderDetailsO,
  coinContractOrderDetails,
  coinContractLedgersO,
  coinContractLedgers,
  formatCoinContractOrder: _formatCoinContractOrder,
  formatCoinContractBalance: _formatCoinContractBalance,
  formatCoinContractPosition: _formatCoinContractPosition,
//
  coinContractPositionsO,
  coinContractPositions,
  coinContractPositionsRiskO: empty,
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
  coinContractAssets,
  coinContractBalances,
  coinContractBalancesO,
};
