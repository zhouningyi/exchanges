
const _ = require('lodash');
// const md5 = require('md5');
//
const Utils = require('./../../../utils');
const { intervalMap, pair2coin, orderTypeMap, reverseOrderTypeMap } = require('./public');
const futureApiUtils = require('./future');
const deepmerge = require('deepmerge');
const publicUtils = require('./public');


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

function swapFundingRateHistoryO(o) {
  const { pair, ...rest } = o;
  return {
    instrument_id: getInstrumentId(pair),
    ...rest
  };
}

function swapFundingRateHistory(ds, o) {
  const { pair } = o;
  return _.map(ds, (d) => {
    const time = new Date(d.funding_time);
    const tstr = Math.floor(time.getTime() / 1000);
    return {
      unique_id: `${pair}_${tstr}`,
      pair,
      funding_rate: _parse(d.funding_rate),
      realized_rate: _parse(d.realized_rate),
      interest_rate: _parse(d.interest_rate),
      time
    };
  });
}


//
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

function swapOrderInfoO(o) {
  return { ..._getInstrumentO(o), order_id: o.order_id };
}

function swapOrderInfo(ds, o) {
  const res = formatSwapOrder(ds, o);
  res.pair = inst2pair(ds.instrument_id);
  return res;
}

function _formatSwapPosition(l) {
  const { instrument_id } = l;
  const pair = inst2pair(instrument_id);
  const { side } = l;
  const res = {
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
  return _.values(resMap);
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
  const coin = pair2coin(pair);
  return cleanObjectNull({
    coin,
    pair,
    instrument_id,
    margin_mode: line.margin_mode,
    account_rights: _parse(line.equity),
    balance: _parse(line.total_avail_balance), //	账户余额
    margin: _parse(line.margin),
    profit_real: _parse(line.realized_pnl),
    profit_unreal: _parse(line.unrealized_pnl),
    margin_ratio: _parse(line.margin_ratio), // 保证金率
    margin_used: _parse(line.margin_frozen),
    server_updated_at: new Date(line.timestamp),
    maint_margin_ratio: _parse(line.maint_margin_ratio),
    can_withdraw: _parse(line.max_withdraw),
    time: new Date()
  });
}

function swapBalances(res, o) {
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
  return [_formatBalance(info)];
}

function _getInstrumentO(o) {
  const pair = o.pair || `${o.coin}-USD`;
  const instrument_id = getInstrumentId(pair);
  return { instrument_id };
}

function swapOrdersO(o) {
  const client_oid = o.client_oid || o.oid;
  const { order_type } = o;
  const res = {
    ..._getInstrumentO(o),
    state: futureApiUtils.futureStatusMap[o.state || o.status],
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
  res.instrument = 'swap';
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

function setSwapLeverateO(o) {
  const side = o.side || 3;
  return { ..._getInstrumentO(o), leverage: o.lever_rate, side };
}
function setSwapLeverate(res, o) {
  return [res];
}

const swapLedgerTypeMap = {
  funding: 14
};

function swapLedgerO(o) {
  const opt = { instrument_id: getInstrumentId(o.pair), };
  if (o.type) opt.type = swapLedgerTypeMap[o.type];
  return opt;
}

function swapLedger(ds, o) {
  return _.map(ds, d => publicUtils.formatAssetLedger(d, { ...o, instrument: 'swap', asset_type: 'swap' }));
}

function swapFillsO(o) {
  return { instrument_id: getInstrumentId(o.pair), };
}

function swapFills(ds, o) {
  return _.map(ds, d => publicUtils.formatFill(d, { ...o, instrument: 'swap', asset_type: 'swap' }));
}

module.exports = {
  formatSwapOrder,
  getSwapInstrumentId: getInstrumentId,
  inst2pair,
  formatSwapKline: _formatSwapKline,
  formatSwapPosition,
  swapKline,
  swapKlineO,
  swapFundingRateHistoryO,
  swapFundingRateHistory,
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
  swapPositions,
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
  swapFillsO,
  swapFills,
  swapLedgerO,
  swapLedger,
  setSwapLeverateO,
  setSwapLeverate,
};
