
const _ = require('lodash');
// const md5 = require('md5');
//
const Utils = require('./../../../utils');
const ef = require('./../../../utils/formatter');
const { intervalMap, pair2coin, orderTypeMap, getPrecision, reverseOrderTypeMap } = require('./public');
const futureApiUtils = require('./future');
const deepmerge = require('deepmerge');
const publicUtils = require('./public');

const balance_type = 'SWAP';
const asset_type = 'SWAP';
const exchange = 'OKEX';

const { checkKey, throwError, cleanObjectNull } = Utils;

function direct(d) {
  return d;
}

function _parse(v) {
  return parseFloat(v, 10);
}
function getInstrumentId(pair) {
  pair = futureApiUtils.formatFuturePair(pair);
  return `${pair}-SWAP`;
}
function inst2pair(symbol) {
  return symbol.replace('-SWAP', '').replace('_', '-');
}

function swapTicksO(o = {}) {
  return o;
}
function formatTick(d) {
  const { instrument_id } = d;
  const pair = inst2pair(instrument_id);
  return {
    instrument_id,
    ask_price: _parse(d.best_ask),
    bid_price: _parse(d.best_bid),
    hold_amount: _parse(d.open_interest),
    last_price: _parse(d.last),
    time: new Date(d.timestamp),
    pair,
  };
}

function swapTicks(ds) {
  return _.map(ds, formatTick);
}


function swapKlineO(o) {
  const { pair, interval = '15m' } = o;
  const granularity = intervalMap[interval];
  const res = { instrument_id: getInstrumentId(pair), granularity };
  if (o.timeStart) res.start = o.timeStart;
  if (o.timeEnd) res.end = o.timeEnd;
  return res;
}

function _formatSwapKline(l, o) {
  const { pair, interval } = o;
  const time = new Date(l[0]);
  const tstr = time.getTime();
  const unique_id = `${pair}_${interval}_${tstr}`;
  return {
    unique_id,
    interval,
    pair,
    time,
    open: _parse(l[1]),
    high: _parse(l[2]),
    low: _parse(l[3]),
    close: _parse(l[4]),
    volume_coin: _parse(l[5]),
    volume_amount: _parse(l[6]),
  };
}
function swapKline(res, o) {
  return _.map(res, l => _formatSwapKline(l, o));
}

function swapOrderO(o) {
  const res = futureApiUtils.futureOrderO(o);
  if (res) res.instrument_id = getInstrumentId(o.pair);
  return res;
}
function swapOrder(res, o) {
  return futureApiUtils.futureOrder(res, o);
}

function batchCancelSwapOrdersO(o) {
  const res = _getInstrumentO(o);
  const ids = o.order_id || o.order_ids;
  if (ids) res.ids = ids;
  return res;
}
function batchCancelSwapOrders(res, o) {
  if (!res) return null;
  const { instrument_id } = res;
  const order_ids = res.order_ids || res.ids;
  return _.map(order_ids, order_id => ({
    order_id,
    pair: inst2pair(instrument_id),
    instrument: 'swap',
    status: 'CANCEL',
  }));
}

function swapCancelOrderO(o = {}) {
  const { instrument_id } = _getInstrumentO(o);
  const cancel_order_id = o.order_id || o.client_oid;
  return { instrument_id, cancel_order_id };
}

function swapCancelOrder(res, o = {}) {
  const resp = { ...o };
  if (res) {
    const { order_id, client_oid, error_code } = res;
    if (error_code === '0')resp.status = 'CANCEL';
    if (client_oid) resp.client_oid = client_oid;
    if (order_id) resp.order_id = order_id;
  }
  return resp;
}

function swapOrderInfoO(o) {
  return { ..._getInstrumentO(o), order_id: o.order_id || o.client_oid };
}

function swapOrderInfo(ds, o) {
  if (ds.error) return { ...o };
  const res = formatSwapOrder(ds, o);
  res.pair = inst2pair(ds.instrument_id);
  return res;
}


function _formatSwapPosition(l) {
  const { instrument_id } = l;
  const pair = inst2pair(instrument_id);
  const { side } = l;
  const res = {
    exchange,
    asset_type,
    unique_id: instrument_id,
    instrument_id,
    pair,
    coin: pair2coin(pair),
    liquidation_price: _parse(l.liquidation_price),
    margin: _parse(l.margin),
    [`${side}_margin`]: _parse(l.margin),
    [`${side}_last_price`]: _parse(l.last),
    [`${side}_settlement_price`]: _parse(l.settlement_price),
    [`${side}_amount`]: _parse(l.position),
    [`${side}_margin`]: _parse(l.margin),
    [`${side}_avail_amount`]: _parse(l.avail_position),
    [`${side}_price_avg`]: _parse(l.avg_cost),
    [`${side}_settlement_price`]: _parse(l.settlement_price),
    lever_rate: _parse(l.leverage),
    maint_margin_ratio: _parse(l.maint_margin_ratio),
    [`${side}_benifit`]: _parse(l.settled_pnl),
    [`${side}_realize_benifit`]: _parse(l.realized_pnl),
    [`${side}_unrealize_benifit`]: _parse(l.unrealized_pnl),
    server_updated_at: new Date(l.timestamp),
    time: new Date(),
  };
  if (l.margin_ratio) res.margin_ratio = _parse(l.margin_ratio);
  res.instrument_id = ef.getInstrumentId(res);
  return res;
}

function formatSwapPosition(res) {
  if (!res) return null;
  const resMap = {};
  _.forEach(res, (l) => {
    const { margin_mode, timestamp, holding, instrument_id: _instrument_id } = l;
    const time = new Date(timestamp);
    _.forEach(holding, (l) => {
      const instrument_id = l.instrument_id || _instrument_id;
      const old = resMap[instrument_id] || {
        // long_amount: 0,
        // long_margin: 0,
        // short_amount: 0,
        // short_margin: 0
      };
      const _l = { ..._formatSwapPosition({ instrument_id, ...l }), margin_mode, time };
      const newl = deepmerge(old, _l);
      resMap[instrument_id] = newl;
    });
  });
  const resp = _.values(resMap);
  _.forEach(resp, (l) => {
    l.vector = (l.long_amount || 0) - (l.short_amount || 0);
    l.amount = Math.abs(l.vector);
  });
  return resp;
}

function swapPosition(ds, o) {
  let res = formatSwapPosition([ds]);
  res = _.map(res, (l) => {
    return Object.assign(
      { short_amount: 0, short_margin: 0, short_avail_amount: 0, long_amount: 0, long_margin: 0, long_avail_amount: 0, },
      l
      );
  });
  return res;
}
function swapPositions(ds, o) {
  const res = formatSwapPosition(ds, o);
  return res;
}

// balance
function _formatBalance(line) {
  const { instrument_id } = line;
  const pair = inst2pair(instrument_id);
  const coin = pair.endsWith('USDT') ? 'USDT' : pair2coin(pair);
  // console.log(line, 'line...');
  const res = cleanObjectNull({
    exchange,
    balance_type,
    coin,
    pair,
    margin_mode: line.margin_mode,
    account_rights: _parse(line.equity),
    balance: _parse(line.equity), // _parse(line.total_avail_balance), //	账户余额
    margin: _parse(line.margin),
    profit_real: _parse(line.realized_pnl),
    profit_unreal: _parse(line.unrealized_pnl),
    margin_ratio: _parse(line.margin_ratio), // 保证金率
    margin_used: _parse(line.margin_frozen),
    server_updated_at: new Date(line.timestamp),
    maint_margin_ratio: _parse(line.maint_margin_ratio),
    withdraw_available: _parse(line.max_withdraw),
    time: new Date()
  });
  res.balance_id = ef.getBalanceId(res);
  return res;
}

function swapBalancesO() {
  return {};
}

function swapBalances(res) {
  const info = _.get(res, 'info');
  return _.map(info, _formatBalance);
}

function swapBalanceO(o) {
  const pair = o.pair || `${o.coin}-USD`;
  const instrument_id = getInstrumentId(pair);
  return { instrument_id };
}

function swapBalance(res, o) {
  const info = _.get(res, 'info');
  return _formatBalance(info);
}

function _getInstrumentO(o) {
  const pair = o.pair || `${o.coin}-USD`;
  return { instrument_id: [pair, 'SWAP'].join('-') };
}

function swapOrdersO(o) {
  const client_oid = o.client_oid || o.oid;
  const { order_type } = o;
  const status = o.state || o.status || 'SUCCESS';
  const res = {
    exchange,
    asset_type,
    ..._getInstrumentO(o),
    state: futureApiUtils.futureStatusMap[status],
    from: o.from,
    to: o.to,
    limit: o.limit
  };
  if (client_oid) res.client_oid = client_oid;
  if (order_type) res.order_type = orderTypeMap[order_type];
  return res;
}

function formatSwapOrder(d, o) {
  const res = futureApiUtils.formatContractOrder(d, o);
  if (d.instrument_id) res.pair = inst2pair(d.instrument_id);
  res.exchange = exchange;
  res.asset_type = asset_type;
  res.instrument = 'swap';
  res.instrument_id = ef.getInstrumentId(res);
  return res;
}

function swapOrders(ds, o) {
  if (!ds) return false;
  return _.map(ds.order_info, d => formatSwapOrder(d, o));
}

function unfinishSwapOrdersO(o) {
  return swapOrdersO({ ...o, status: 'UNFINISH' });
}
function unfinishSwapOrders(res, o) {
  return swapOrders(res, o);
}

function getSwapConfig(res, o) {
  return [{
    ...o,
    long_lever_rate: _parse(res.long_leverage),
    short_lever_rate: _parse(res.short_leverage),
    margin_mode: res.margin_mode,
    instrument_id: res.instrument_id
  }];
}

function swapUpdateLeverateO(o) {
  const side = o.side || 3;
  return { ..._getInstrumentO(o), leverage: o.lever_rate, side };
}
function swapUpdateLeverate(res, o) {
  const short_leverage = _parse(res.short_leverage);
  const long_leverage = _parse(res.long_leverage);
  return { ...o, long_leverage, short_leverage };
}

const swapLedgerTypeMap = {
  funding: 14,
  [ef.ledgerTypes.FUNDING_RATE]: 14
};

function swapLedgerO(o) {
  const opt = { instrument_id: getInstrumentId(o.pair), };
  if (o.type) opt.type = swapLedgerTypeMap[o.type];
  return opt;
}

function formatSwapLedger(d, o) {
  const res = publicUtils.formatAssetLedger(d, { ...o, instrument: asset_type, asset_type });
  return { ...res, asset_type, exchange };
}

function swapLedger(ds, o) {
  const res = _.map(ds, d => formatSwapLedger(d, o));
  return res;
}

function instrument_id2pair(instrument_id) {
  return instrument_id.replace('-SWAP', '');
}
function _formatSwapOrderDetail(d, o) {
  const pair = instrument_id2pair(d.instrument_id);
  let fee_coin = pair2coin(pair);
  if (ef.isUsdtPair(pair)) fee_coin = 'USDT';
  const exec_type = { M: 'MAKER', T: 'TAKER' }[d.exec_type];
  const res = {
    ...o,
    exchange,
    asset_type,
    unique_id: `${d.trade_id}`,
    order_id: `${d.order_id}`,
    pair,
    exec_type,
    direction: d.direction === 'buy' ? 'LONG' : 'SHORT',
    side: d.side.toUpperCase(),
    amount: _parse(d.order_qty),
    price: _parse(d.price),
    fee: _parse(d.fee),
    time: new Date(d.timestamp),
    fee_coin,
  };
  res.instrument_id = ef.getInstrumentId(res);
  return res;
}

function swapOrderDetailsO(o) {
  return { instrument_id: getInstrumentId(o.pair), };
}

function swapOrderDetails(ds, o) {
  return _.map(ds, d => _formatSwapOrderDetail(d, { ...o, asset_type, exchange }));
}


function swapAssets(ds) {
  return _.map(ds, (d) => {
    const res = {
      exchange,
      asset_type,
      pair: d.underlying,
      min_size: _parse(d.size_increment),
      price_precision: getPrecision(d.tick_size),
      delivery: d.delivery
    };
    res.instrument_id = ef.getInstrumentId(res);
    return res;
  });
}


function empty() {
  return {};
}

function swapCurrentFundingO(o = {}) {
  const { pair, kline, ...rest } = o;
  return { instrument_id: getInstrumentId(pair), ...rest };
}
function swapCurrentFunding(res) {
  const pair = res.instrument_id.replace('-SWAP', '');
  const funding_time = new Date(_parse(res.funding_time));
  const hour8 = 8 * 3600 * 1000;
  const next_funding_time = new Date(funding_time.getTime() + hour8);
  return {
    exchange,
    asset_type,
    time: new Date(),
    pair,
    estimated_rate: _parse(res.estimated_rate),
    next_funding_time,
    funding_rate: _parse(res.funding_rate),
    funding_time
  };
}

function swapFundingHistoryO(o) {
  const { pair, kline, ...rest } = o;
  return { instrument_id: getInstrumentId(pair), ...rest };
}

function swapFundingHistory(ds, o) {
  const { pair } = o;
  return _.map(ds, (d) => {
    const time = new Date(d.funding_time);
    const tlong = time.getTime();
    let fee_asset = pair2coin(pair);
    if (ef.isUsdtPair(pair)) fee_asset = 'USDT';
    const res = {
      exchange,
      asset_type,
      pair,
      funding_rate: _parse(d.funding_rate),
      realized_rate: _parse(d.realized_rate),
      interest_rate: _parse(d.interest_rate),
      time,
      fee_asset
    };
    res.instrument_id = ef.getInstrumentId(res);
    res.unique_id = [res.instrument_id, tlong].join('_');
    return res;
  });
}


module.exports = {
  swapLedgerO,
  swapLedger,
  swapCurrentFundingO,
  swapCurrentFunding,
  swapCancelOrderO,
  swapCancelOrder,
  swapAssetsO: empty,
  swapAssets,
  formatSwapOrder,
  getSwapInstrumentId: getInstrumentId,
  inst2pair,
  formatSwapKline: _formatSwapKline,
  formatSwapPosition,
  swapKline,
  swapKlineO,
  swapFundingHistoryO,
  swapFundingHistory,
  formatTick,
  swapTicksO,
  swapTicks,
  swapOrderO,
  swapOrder,
  batchCancelSwapOrdersO,
  batchCancelSwapOrders,
  swapOrderInfoO,
  swapOrderInfo,
  swapPositionO: _getInstrumentO,
  swapPosition,
  swapPositionsO: empty,
  swapPositions,
  swapBalancesO,
  swapBalances,
  formatSwapBalance: _formatBalance,
  swapBalanceO,
  swapBalance,
  swapOrdersO,
  swapOrders,
  unfinishSwapOrders,
  unfinishSwapOrdersO,
  getSwapConfigO: _getInstrumentO,
  getSwapConfig,
  swapOrderDetailsO,
  swapOrderDetails,
  swapUpdateLeverateO,
  swapUpdateLeverate,
};
