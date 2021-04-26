const publicUtils = require('./public');
const _ = require('lodash');

const formatSpotContractDepth = publicUtils.formatDepth;
const { getSymbolId, getPrecision, formatInterval, parseSymbolId, getOrderDirectionOptions, parseOrderStatusOptions, getOrderTypeOptions, parseOrderDirectionOptions } = publicUtils;
const ef = require('./../../../utils/formatter');
const { cleanObjectNull } = require('../../../utils');

const exchange = 'BINANCE';
const balance_type = 'SPOT';

function empty() {
  return {};
}

function _parse(v) {
  return parseFloat(v, 10);
}
function spotInterestO(o) {
  const { exchange, asset_type, timestamp } = o;
  const res = { exchange, asset_type, timestamp };
  if (o.timeStart) res.start = o.timeStart.toISOString();
  if (o.timeEnd) res.end = o.timeEnd.toISOString();
  return res;
}

function _formatInterest(d, o) {
  const exchange = 'BINANCE';
  const asset_type = 'SPOT';
  const time = new Date(d.interestAccuredTime);
  const pair = d.isolatedSymbol;
  const unique_id = `${exchange}_${asset_type}_${pair}`;
  return {
    time,
    unique_id,
    exchange,
    asset_type,
    interest: _parse(d.interest),
    interest_rate: _parse(d.interestRate),
    type: d.type,
    pair,
    principal: _parse(d.principal)
  };
}
function spotInterest(ds, o) {
  return _.map(ds, l => _formatInterest(l, o));
}

function getSpotSymbol(o) {
  return getSymbolId({ asset_type: 'SPOT', pair: o.pair });
}
function spotKlineO(o = {}) {
  const opt = {
    symbol: getSpotSymbol(o),
    interval: formatInterval(o)
  };
  return opt;
}
function getSpotInstrumentId(o = {}) {
  return ef.getInstrumentId({ asset_type: 'SPOT', exchange: 'BINANCE', pair: o.pair });
}
function _formatSpotKline(d, o) {
  const instrument_id = getSpotInstrumentId(o);
  const timestamp = d[0];
  return {
    unique_id: [instrument_id, timestamp].join('_'),
    instrument_id,
    time: new Date(timestamp),
    open: _parse(d[1]),
    high: _parse(d[2]),
    low: _parse(d[3]),
    close: _parse(d[4]),
    volume: _parse(d[5]),
    volume_base: _parse(d[7]),
    count: _parse(d[8]),
    volume_long: _parse(d[9]),
  };
}
function spotKline(ds, o) {
  return _.map(ds, d => _formatSpotKline(d, o));
}

// //私有
function spotBalances(ds, o) {
  const resp = _.map(ds.balances, (d) => {
    const res = {
      exchange,
      balance_type,
      coin: d.asset,
      balance: d.balance ? _parse(d.balance) : (_parse(d.free) + _parse(d.locked)),
      locked_balance: _parse(d.locked)
    };
    res.balance_available = res.avaliable_balance = res.balance - res.locked_balance;
    res.balance_id = ef.getBalanceId(res);
    return res;
  });
  return resp;
}

function _formatSpotOrder(d, o = {}) {
  const { assets, asset, ...rest } = o;
  const { symbol: symbol_id } = d;
  const info = parseSymbolId(d);
  const res = {
    ...rest,
    ...parseOrderStatusOptions(d),
    ...getOrderTypeOptions(d),
    direction: 'LONG',
    time: new Date(d.time || d.transactTime),
    ...info,
  };
  if (symbol_id) res.symbol_id = symbol_id;
  if (d.executedQty) res.filled_amount = _parse(d.executedQty);
  if (d.orderId) res.order_id = `${d.orderId}`;
  if (d.qty || d.origQty) res.amount = _parse(d.qty || d.origQty);
  if (d.price) res.price = _parse(d.price);
  if (d.clientOrderId) res.client_oid = `${d.clientOrderId}`;
  if (d.side) res.side = d.side.toUpperCase();
  if (d.commission) res.fee = _parse(d.commission);
  if (d.price_avg) res.price_avg = _parse(d.price_avg);
  if (d.eventTime) res.server_updated_at = new Date(d.eventTime);
  if (d.time && !res.server_updated_at) res.server_updated_at = new Date(d.time);
  return cleanObjectNull(res);
}

function spotOrdersO(o = {}) {
  return { symbol: getSpotSymbol(o) };
}

function spotOrders(ds, o) {
  return _.map(ds, d => _formatSpotOrder(d, o));
}


function _formatSpotAsset(d) {
  const res = { ...parseSymbolId(d), pair: [d.baseAsset, d.quoteAsset].join('-') };
  const filtersMap = _.keyBy(d.filters, d => d.filterType);
  if (filtersMap) {
    const { PRICE_FILTER, LOT_SIZE } = filtersMap;
    if (PRICE_FILTER) res.price_precision = getPrecision(PRICE_FILTER.tickSize);
    if (LOT_SIZE) res.amount_precision = getPrecision(LOT_SIZE.stepSize);
    // amount_precision
  }
  return res;
}


function spotAssets(res, o) {
  const resp = _.map(res.symbols, _formatSpotAsset);
  return resp;
}

function spotOrderO(o = {}) {
  const opt = {
    symbol: getSpotSymbol(o),
    ...getOrderDirectionOptions(o),
    ...getOrderTypeOptions(o),
    newOrderRespType: 'ACK',
    quantity: o.amount
  };
  if (o.client_oid) opt.newClientOrderId = o.client_oid;
  if (o.price) opt.price = o.price;
  return opt;
}

function spotOrder(res, o = {}) {
  return _formatSpotOrder(res, o);
}


function spotCancelOrderO(o) {
  return publicUtils.formatOrderO({ asset_type: 'SPOT', ...o });
}

function spotCancelOrder(d, o) {
  return _formatSpotOrder(d, o);
}

function spotOrderInfoO(o = {}) {
  return publicUtils.formatOrderO({ asset_type: 'SPOT', ...o });
}
const spotOrderInfo = _formatSpotOrder;

function spotUnfinishOrdersO(o) {
  return { symbol: getSpotSymbol(o) };
}

const spotUnfinishOrders = (ds, o) => {
  return _.map(ds, d => _formatSpotOrder(d, o));
};


function spotOrderDetailsO(o = {}) {
  return { symbol: getSpotSymbol(o) };
}
function _formatSpotOrderDetail(d) {
  const { symbol: symbol_id } = d;
  const res = {
    unique_id: `${exchange}_${d.id}`,
    symbol_id,
    ...parseSymbolId(d),
    order_id: `${d.orderId}`,
    price: _parse(d.price),
    amount: _parse(d.qty),
    amount_base: _parse(d.quoteQty),
    fee: _parse(d.commission),
    fee_coin: d.commissionAsset,
    time: new Date(d.time),
    side: d.isBuyer ? 'BUY' : 'SELL',
    exec_type: d.isMaker ? 'MAKER' : 'TAKER',
  };
  return res;
}
function spotOrderDetails(ds, o) {
  return _.map(ds, d => _formatSpotOrderDetail(d, o));
}

// 1: 现货账户向USDT合约账户划转
// 2: USDT合约账户向现货账户划转
// 3: 现货账户向币本位合约账户划转
// 4: 币本位合约账户向现货账户划转

function getMoveBalanceId({ source, target }) {
  if (source === 'SPOT') {
    if (target === 'COIN_CONTRACT') return 3;
    if (target === 'USDT_CONTRACT') return 1;
  } else if (target === 'SPOT') {
    if (source === 'COIN_CONTRACT') return 4;
    if (source === 'USDT_CONTRACT') return 2;
  }
  console.log('getMoveBalanceId: 找不到对应的资产转换');
}
function spotMoveBalanceO(o = {}) {
  return {
    asset: o.coin,
    amount: o.amount,
    type: getMoveBalanceId(o),
  };
}
function spotMoveBalance(res, o) {
  if (!res) return { error: '返回为空' };
  if (res.tranId) return { success: true, txid: `${res.tranId}`, ...o };
}

function spotSystemStatus(ds) {
  // console.log(ds, 'ds....');
}

module.exports = {
  spotSystemStatus,
  formatSpotOrder: _formatSpotOrder,
  spotMoveBalanceO,
  spotMoveBalance,
  spotOrderDetailsO,
  spotOrderDetails,
  spotUnfinishOrdersO,
  spotUnfinishOrders,
  spotOrderInfoO,
  spotOrderInfo,
  spotCancelOrderO,
  spotCancelOrder,
  spotOrderO,
  spotOrder,
  spotAssetsO: empty,
  spotAssets,
  spotOrdersO,
  spotOrders,
  spotBalancesO: empty,
  spotBalances,
  spotKlineO,
  spotKline,
  formatSpotContractDepth,
  spotInterestO,
  spotInterest
};
