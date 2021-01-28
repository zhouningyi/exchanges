
const _ = require('lodash');
const { pair2coin } = require('../../../utils/formatter');
const { getContractOrderType, contractStatusMap, rContractStatusMap, getContractOrderProps, getRContractOrderProps, contractOrderPriceTypeMap, formatDotArray, processContractCancelOrderSuccesses, processContractCancelOrderErrors } = require('./public');
// const md5 = require('md5');
//
const ef = require('./../../../utils/formatter');
const Utils = require('./../../../utils');

const exchange = 'HUOBI';
const asset_type = 'SWAP';

const { checkKey } = Utils;


function direct(d) {
  return d;
}

function _parse(v) {
  return parseFloat(v, 10);
}


function _formatCoinSwapAsset(d) {
  const pair = `${d.symbol}-USD`;
  const res = {
    exchange,
    pair,
    asset_type,
    contract_size: _parse(d.contract_size),
    isable: d.contract_status === 1,
    price_precision: d.price_tick
  };
  res.instrument_id = Utils.formatter.getInstrumentId(res);
  return res;
}

function coinSwapAssets(ds) {
  return _.map(ds, _formatCoinSwapAsset);
}

function _formatCoinSwapBalance(d) {
  const pair = `${d.symbol}-USD`;
  const res = {
    exchange,
    asset_type,
    balance_type: 'COIN_SWAP',
    coin: d.symbol,
    pair,
    account_rights: _parse(d.margin_balance),
    balance: _parse(d.margin_balance),
    risk_rate: d.risk_rate ? _parse(d.risk_rate) : null, // 保证金率
    lever_rate: _parse(d.lever_rate),
    profit_real: _parse(d.profit_real),
    profit_unreal: _parse(d.profit_unreal),
    withdraw_available: _parse(d.withdraw_available),
    adjust_factor: _parse(d.adjust_factor),
    margin_used: _parse(d.margin_position),
    margin: _parse(d.margin || d.margin_position),
    liquidation_price: d.liquidation_price ? _parse(d.liquidation_price) : null,
    time: new Date()
  };
  res.balance_id = ef.getBalanceId(res);
  return res;
}

function coinSwapBalances(ds) {
  return _.map(ds, _formatCoinSwapBalance);
}

// 仓位
function formatSwapCoinPositions(ds, o) {
  const group = _.groupBy(ds, d => d.contract_code);
  const res = [];
  _.forEach(group, (arr, contract_code) => {
    const _res = { pair: contract_code, exchange, asset_type };
    res.push(_res);
    const mapper = _.keyBy(arr, 'direction');
    const { sell, buy } = mapper;
    let profit_unreal = 0;
    let vector = 0;
    let margin = 0;
    let amount = 0;
    if (sell) {
      _res.short_amount = sell.volume;
      _res.short_benifit = sell.profit;
      _res.short_open_price = sell.cost_open;
      _res.short_margin = sell.position_margin;
      _res.short_locked = sell.frozen;
      profit_unreal += sell.profit_unreal;
      _res.lever_rate = sell.lever_rate;
      vector -= sell.volume;
      amount += sell.volume;
      _res.mark_price = sell.last_price;
      margin += sell.position_margin;
    }
    if (mapper.buy) {
      _res.long_amount = buy.volume;
      _res.long_benifit = buy.profit;
      _res.long_open_price = buy.cost_open;
      _res.long_margin = buy.position_margin;
      _res.long_locked = buy.frozen;
      _res.long_profit_unreal = buy.profit_unreal;
      profit_unreal += buy.profit_unreal;
      _res.lever_rate = buy.lever_rate;
      vector += buy.volume;
      amount += buy.volume;
      _res.mark_price = buy.last_price;
      margin += buy.position_margin;
    }
    _res.margin = margin;
    _res.vector = vector;
    _res.amount = amount;
    _res.time = new Date();
    _res.coin = pair2coin(_res.pair);
    _res.profit_unreal = profit_unreal;
    _res.instrument_id = ef.getInstrumentId(_res);
  });
  return res;
}

function coinSwapPositionsO(o) {
  return {};
}
function coinSwapPositions(ds, o) {
  return formatSwapCoinPositions(ds);
}


function coinSwapOrderO(o = {}) {
  const { amount, lever_rate, asset_type, client_oid, price, pair } = o;
  o.direction = o.direction.toLowerCase();
  o.side = o.side.toUpperCase();
  //
  const opt = {
    contract_code: pair,
    price,
    volume: amount,
    lever_rate,
    ...getContractOrderProps(o),
    order_price_type: getContractOrderType(o)
  };
  if (client_oid) opt.client_order_id = client_oid;
  return opt;
}
function coinSwapOrder(d, o) {
  const res = { ...o, order_id: d.order_id_str };
  if (d.client_order_id) res.client_oid = `${d.client_order_id}`;
  return res;
}


function coinSwapCancelOrderO(o) {
  const { pair } = o;
  const opt = { contract_code: pair };
  if (o.order_id) opt.order_id = `${o.order_id}`;
  if (o.client_oid) opt.client_order_id = `${o.client_oid}`;
  return opt;
}

function coinSwapCancelOrder(res, o) {
  return [...processContractCancelOrderErrors(res, o), ...processContractCancelOrderSuccesses(res, o)].filter(d => d)[0];
}

function _formatCoinSwapOrder(l, o) {
  const { status, symbol: coin, trade, profit, price, lever_rate, volume: amount, create_date, created_at, order_source, offset, trade_volume: deal_amount, order_price_type, fee } = l;
  const ct = create_date || created_at;
  const pair = l.contract_code || `${coin}-USD`;
  const order_id = l.order_id_str || `${l.order_id}`;
  const res = {
    coin,
    pair,
    unique_id: coin + order_id,
    asset_type,
    exchange,
    order_id,
    order_source,
    benifit: profit,
    lever_rate,
    type: contractOrderPriceTypeMap[order_price_type],
    amount: _parse(amount),
    price: _parse(price),
    filled_amount: deal_amount,
    fee: _parse(fee),
    ...getRContractOrderProps(l),
    server_created_at: ct ? new Date(ct) : undefined,
    server_updated_at: new Date(),
    status: rContractStatusMap[status]
  };
  if (trade)res.trade = trade;
  if (l.client_order_id) res.client_oid = `${l.client_order_id}`;
  res.instrument_id = ef.getInstrumentId(res);
  return res;
}


function coinSwapOrderInfoO(o = {}) {
  const res = {
    contract_code: o.pair
  };
  if (o.order_id) res.order_id = formatDotArray(o.order_id);
  if (o.client_oid) res.client_order_id = formatDotArray(o.client_oid);
  return res;
}
function coinSwapOrderInfo(res, o) {
  if (!res || res.error) return false;
  res = _.map(res, d => _formatCoinSwapOrder(d, o));
  if (res && res.length === 1) res = res[0];
  return res;
}

function coinSwapUnfinishOrdersO(o = {}) {
  return { contract_code: o.pair };
}
function coinSwapUnfinishOrders(ds, o) {
  return _.map(ds.orders, d => _formatCoinSwapOrder(d, o));
}

function coinSwapOrderDetailsO(o = {}) {
  return { contract_code: o.pair, trade_type: 0, create_date: 1 };
}
function _formatCoinSwapOrderDetail(d, o) {
  const res = {
    exchange,
    asset_type: 'SWAP',
    unique_id: `${d.match_id}`,
    order_id: `${d.order_id_str}`,
    pair: `${o.pair}`,
    exec_type: d.role.toUpperCase(),
    direction: d.direction === 'buy' ? 'LONG' : 'SHORT',
    side: d.offset === 'open' ? 'BUY' : 'SELL',
    amount: d.trade_volume,
    price: d.trade_price,
    fee: -1 * d.trade_fee,
    time: new Date(d.create_date),
    fee_coin: d.fee_asset,
  };
  res.instrument_id = ef.getInstrumentId(res);
  return res;
}
function coinSwapOrderDetails(ds, o) {
  return _.map(ds.trades, d => _formatCoinSwapOrderDetail(d, o));
}

function coinSwapUpdateLeverateO(o) {
  const { lever_rate, pair } = o;
  return { contract_code: pair, lever_rate };
}
function coinSwapUpdateLeverate(res, o) {
  if (!res) return null;
  const { lever_rate } = res;
  return { ...o, lever_rate };
}

function coinSwapFundingHistoryO(o = {}) {
  return { contract_code: o.pair };
}
function _formatFundingRate(d, o) {
  const t = new Date(_parse(d.funding_time));
  const tlong = t.getTime();
  const res = {
    exchange,
    asset_type,
    pair: o.pair,
    avg_premium_index: _parse(d.avg_premium_index),
    funding_rate: _parse(d.funding_rate),
    realized_rate: _parse(d.realized_rate),
    time: t,
    fee_asset: d.fee_asset
  };
  res.instrument_id = ef.getInstrumentId(res);
  res.unique_id = [res.instrument_id, tlong].join('_');
  return res;
}

function coinSwapFundingHistory(res, o) {
  return _.map(res.data, d => _formatFundingRate(d, o));
}

function coinSwapCurrentFunding(d, o) {
  return {
    exchange,
    asset_type,
    time: new Date(),
    pair: o.pair,
    estimated_rate: _parse(d.estimated_rate),
    next_funding_time: new Date(_parse(d.next_funding_time)),
    funding_rate: _parse(d.funding_rate),
    funding_time: new Date(_parse(d.funding_time)),
  };
}

function coinSwapMoveBalanceO(o = {}) {
  const opt = { currency: o.coin, amount: o.amount };
  const source = o.source.toUpperCase();
  const target = o.target.toUpperCase();
  if (source === 'COIN_SWAP' && target === 'SPOT') {
    opt.from = 'swap';
    opt.to = 'spot';
  } else if (source === 'SPOT' && target === 'COIN_SWAP') {
    opt.from = 'spot';
    opt.to = 'swap';
  } else {
    console.log('coinSwapMoveBalanceO/from | to 错误...');
  }
  return opt;
}

function coinSwapMoveBalance(res, o) {
  if (typeof res === 'number' || typeof res === 'string') return { success: true, txid: `${res}`, ...o };
  return false;
}


const ledgerTypeMap = {
  [ef.ledgerTypes.FUNDING_RATE]: '30,31',
};
const reverseLedgerTypeMap = {
  30: ef.ledgerTypes.FUNDING_RATE,
  31: ef.ledgerTypes.FUNDING_RATE,
};

function coinSwapLedgerO(o) {
  const { type, pair } = o;
  const opt = { contract_code: pair };
  if (type) opt.type = ledgerTypeMap[type];
  return opt;
}

function _formatCoinSwapLedger(d) {
  return {
    id: d.id,
    asset_type: 'SWAP',
    pair: `${d.symbol}-USD`,
    exchange,
    type: reverseLedgerTypeMap[d.type],
    balance: d.amount,
    coin: d.symbol,
    time: new Date(d.ts),
  };
}
function coinSwapLedger(ds) {
  return ds ? _.map(ds.financial_record, _formatCoinSwapLedger) : [];
}

function coinSwapOrdersO(o = {}) {
  const opt = { contract_code: o.pair, trade_type: 0, status: 0, type: 0, create_date: 0 };
  return opt;
}

function coinSwapOrders(ds) {
  const res = _.map(ds.orders, _formatCoinSwapOrder);
  return res;
}

function empty() {
  return {};
}
// coinSwapOrders;

module.exports = {
  coinSwapOrdersO,
  coinSwapOrders,
  coinSwapLedgerO,
  coinSwapLedger,
  formatCoinSwapBalance: _formatCoinSwapBalance,
  formatCoinSwapOrder: _formatCoinSwapOrder,
  formatSwapCoinPositions,
  coinSwapMoveBalanceO,
  coinSwapMoveBalance,
  coinSwapFundingHistoryO,
  coinSwapFundingHistory,
  coinSwapCurrentFundingO: coinSwapFundingHistoryO,
  coinSwapCurrentFunding,
  coinSwapUpdateLeverateO,
  coinSwapUpdateLeverate,
  coinSwapOrderDetailsO,
  coinSwapOrderDetails,
  coinSwapUnfinishOrdersO,
  coinSwapUnfinishOrders,
  coinSwapOrderInfoO,
  coinSwapOrderInfo,
  coinSwapAssetsO: empty,
  coinSwapAssets,
  coinSwapBalances,
  coinSwapPositionsO,
  coinSwapPositions,
  coinSwapOrderO,
  coinSwapOrder,
  coinSwapCancelOrderO,
  coinSwapCancelOrder
};
