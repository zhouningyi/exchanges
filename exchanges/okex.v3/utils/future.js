const _ = require('lodash');
const Utils = require('./../../../utils');
const md5 = require('md5');
// const moment = require('moment');
const error = require('./../errors');
const { accountTypeMap, intervalMap } = require('./public');

const { checkKey, throwError, cleanObjectNull } = Utils;


const { _parse } = Utils;

const d7 = 7 * 24 * 3600 * 1000;
const d14 = d7 * 2;
function future_id2contract_type(instrument_id) {
  if (!instrument_id) return null;
  const arr = instrument_id.split('-');
  const tsr = arr[arr.length - 1];
  const year = tsr.substring(0, 2);
  const month = tsr.substring(2, 4);
  const day = tsr.substring(4, 6);
  const tstr = `20${year}-${month}-${day} 16:10:00`;
  const dt = new Date(tstr) - new Date();
  if (dt > d14) return 'quarter';
  if (dt > d7) return 'next_week';
  return 'this_week';
}

function _formatFuturePosition(line) {
  if (!line || !line.margin_mode) return null;
  const pair = future_id2pair(line.instrument_id);
  const coin = pair.toUpperCase().split('-USD')[0];
  const contract_type = future_id2contract_type(line.instrument_id);
  const long_amount = _parse(line.long_qty);
  const short_amount = _parse(line.short_qty);
  const direction = ((long_amount || 0) - (short_amount || 0)) > 0 ? 'UP' : 'DOWN';
  return {
    unique_id: [contract_type, coin].join('_'),
    margin_mode: line.margin_mode,
    liquidation_price: _parse(line.liquidation_price),
    long_liqu_price: _parse(line.long_liqui_price),
    long_margin: _parse(line.long_margin),
    long_amount,
    long_avaliable_amount: _parse(line.long_avail_qty), // 多仓可以平仓数量
    long_price_avg: _parse(line.long_avg_cost), // 多仓平均开仓价
    long_settlement_price: _parse(line.long_settlement_price),
    long_benifit: _parse(line.long_pnl),
    benifit: _parse(line.realized_pnl),
    short_liqu_price: _parse(line.short_liqui_price),
    short_margin: _parse(line.short_margin),
    short_amount,
    short_avaliable_amount: _parse(line.short_avail_qty), // 多仓可以平仓数量
    short_price_avg: _parse(line.short_avg_cost), // 多仓平均开仓价
    short_settlement_price: _parse(line.short_settlement_price),
    short_benifit: _parse(line.short_pnl),
    instrument_id: line.instrument_id,
    direction,
    pair,
    coin,
    contract_type,
    lever_rate: _parse(line.leverage),
    long_lever_rate: _parse(line.long_leverage),
    short_lever_rate: _parse(line.short_leverage),
    server_updated_at: new Date(line.updated_at),
    server_created_at: new Date(line.created_at),
    time: new Date(),
  };
}

function futurePositions(ds) {
  if (!ds || !ds.result) throwError('futurePositions 返回错误');
  return _.map(_.flatten(ds.holding), _formatFuturePosition);
}

function futurePosition(ds, o = {}) {
  if (!ds || !ds.holding) throwError('futurePosition 返回错误');
  const l = ds.holding[0];
  if (!l) {
    const { contract_type, pair } = o;
    const coin = pair.split('-')[0];
    return {
      unique_id: [contract_type, coin].join('_'),
      margin_mode: ds.margin_mode,
      short_amount: 0,
      long_amount: 0,
      pair,
      coin,
      contract_type,
      time: new Date(),
    };
  }
  const pps = {};
  if (l.created_at.startsWith('1970')) pps.time = new Date();
  return { ..._formatFuturePosition(l), ...pps };
}
function futurePositionO(o) {
  const instrument_id = getCurFutureInstrumentId(o);
  return {
    instrument_id,
  };
}

//
function _formatBalance(line, coin) {
  coin = coin.toUpperCase();
  return cleanObjectNull({
    coin,
    pair: `${coin}-USDT`,
    instrument_id: line.instrument_id,
    margin_mode: line.margin_mode,
    account_rights: _parse(line.equity),
    margin_ratio: _parse(line.margin_ratio), // 保证金率
    maint_margin_ratio: _parse(line.maint_margin_ratio), //
    profit_real: _parse(line.realized_pnl),
    profit_unreal: _parse(line.unrealized_pnl),
    margin_locked: _parse(line.margin_for_unfilled),
    margin_used: _parse(line.margin_frozen),
    can_withdraw: _parse(line.can_withdraw),
    margin: _parse(line.margin),
    balance: _parse(line.total_avail_balance), //	账户余额
    time: new Date()
  });
}

function futureBalancesO(o = {}) {
  return o;
}

function futureBalances(ds) {
  const info = _.get(ds, 'info');
  return _.map(info, _formatBalance);
}


function futureBalanceO(o = {}) {
  return o;
}
function futureBalance(d, o) {
  return _formatBalance(d, o.coin);
}

function futureLedgerO(o = {}) {
  const { pair, ...rest } = o;
  return {
    coin: (pair.split('-')[0]).toLowerCase(),
    ...rest
  };
}

function _futureLedger(d, o) { // 其实可以把Ledger理解为清算
  return {
    unique_id: d.ledger_id,
    ledger_id: d.ledger_id,
    time: new Date(d.timestamp),
    coin_amount: _parse(d.amount), // 币的增减
    amount: _parse(d.balance), // 张数
    coin: d.currency,
    type: d.type, // 流水来源 fee 交易手续费 match 交易 liquidation 爆仓 settlement 交割 transfer 转账
    order_id: _.get(d, 'details.order_id'),
    instrument_id: _.get(d, 'details.instrument_id'),
    ...o
  };
}

function futureLedger(ds, o) {
  return _.map(ds, d => _futureLedger(d, o));
}

function _formatPair(pair) {
  if (!pair) return null;
  return pair.toUpperCase().replace('-USDT', '-USD');
}

function getFutureInstrumentId(pair, contract_type, t = new Date()) {
  const date = Utils.getFutureSettlementDay(t, contract_type);
  const tstr = date.split('-').join('').substring(2);
  const res = `${_formatPair(pair)}-${tstr}`;
  return res;
}
function getCurFutureInstrumentId(o) {
  const { pair, contract_type } = o;
  return getFutureInstrumentId(pair, contract_type, new Date());
}

const futureTypeMap = {//	1:开多2:开空3:平多4:平空
  BUY: {
    UP: 1,
    DOWN: 2
  },
  SELL: {
    UP: 3,
    DOWN: 4
  }
};

const code2Side = {
  1: 'BUY',
  2: 'BUY',
  3: 'SELL',
  4: 'SELL'
};
const code2Direction = {
  1: 'UP',
  2: 'DOWN',
  3: 'UP',
  4: 'DOWN'
};
const orderTypeMap = {
  NORMAL: 0,
  MAKER: 1,
  FOK: 2,
  IOC: 3
};
const reverseTypeMap = _.invert(orderTypeMap);

function futureOrderO(o = {}) {
  const { amount, order_type } = o;
  const direction = o.direction.toUpperCase();
  const side = o.side.toUpperCase();
  const type = o.type.toUpperCase();
  const instrument_id = getCurFutureInstrumentId(o);
  const client_oid = o.client_oid || o.oid;
  const res = {
    instrument_id,
    ..._.pick(o, ['price']),
    size: amount,
    type: _.get(futureTypeMap, `${side}.${direction}`),
    match_price: type === 'LIMIT' ? 0 : 1, // 对手价
  };
  if (client_oid) res.client_oid = client_oid;
  if (order_type) res.order_type = orderTypeMap[order_type.toUpperCase()];
  return res;
}
function futureOrder(line, o = {}) {
  if (!line || !line.result) return false;
  const pps = {};
  if (line.created_at) pps.created_at = new Date(line.created_at);
  return {
    ...pps,
    client_oid: line.client_oid,
    order_id: line.order_id,
    error: line.error_message,
    success: line.result,
    status: 'UNFINISH',
    ...o
  };
}
// 撤销订单
function batchCancelFutureOrdersO(o) {
  const instrument_id = getCurFutureInstrumentId(o);
  return { instrument_id, order_ids: o.order_id || o.order_ids };
}

function batchCancelFutureOrders(line, o) {
  if (!line) return null;
  const { order_id, pair, contract_type } = line;
  return _.map(order_id, l => ({
    order_id: l.client_oid,
    contract_type,
    pair,
    status: 'CANCEL',
  }));
}
// 批撤销订单
function cancelAllFutureOrdersO(o = {}) {
  const { order_ids } = o;
  const instrument_id = getCurFutureInstrumentId(o);
  return { instrument_id, order_ids: order_ids.slice(0, 20) };
}
function cancelAllFutureOrders(res, o) {
  if (!res || !res.result) return null;
  return _.map(res.order_ids, (order_id) => {
    return {
      order_id,
      pair: o.pair,
      contract_type: o.contract_type,
      status: 'CANCEL'
    };
  });
}

// 返回所有订单信息
const futureStatusMap = {
  FAIL: -2, //
  CANCEL: -1, //
  WAITING: 0,
  PARTIAL: 1,
  FILLED: 2, //
  ORDERING: 3,
  CANCELLING: 4,
  UNFINISH: 6,
  SUCCESS: 7,
};

const reverseFutureStatusMap = _.invert(futureStatusMap);

function formatContractOrder(l, o) {
  const res = {
    instrument_id: l.instrument_id,
    amount: _parse(l.size),
    filled_amount: _parse(l.filled_qty),
    fee: -(_parse(l.fee)), // 考虑负手续费的情况
    price: _parse(l.price),
    price_avg: _parse(l.price_avg),
    contract_val: _parse(l.contract_val),
    server_created_at: new Date(l.timestamp),
    order_id: l.order_id,
    order_type: reverseTypeMap[l.order_type],
    side: code2Side[l.type],
    status: reverseFutureStatusMap[l.state],
    direction: code2Direction[l.type],
    ...o,
  };
  if (l.leverage) res.lever_rate = _parse(l.leverage);
  return res;
}

function _formatFutureOrder(l, o) {
  const info = getInfoFromInstrumentId(l.instrument_id);
  const res = {
    ...info,
    ...formatContractOrder(l, o)
  };
  if (l.client_oid) res.client_oid = l.client_oid;
  return res;
}

function futureOrdersO(o = {}) {
  const instrument_id = getCurFutureInstrumentId(o);
  return {
    instrument_id,
    state: futureStatusMap[o.state || o.status],
    from: o.from,
    to: o.to,
    limit: o.limit
  };
}
function futureOrders(ds, o) {
  if (!ds) return false;
  return _.map(ds.order_info, d => _formatFutureOrder(d, o));
}
function unfinishFutureOrdersO(o = {}) {
  return futureOrdersO({ ...o, status: 'UNFINISH' });
}

function successFutureOrdersO(o) {
  return futureOrdersO({ ...o, status: 'SUCCESS' });
}
// 返回单个订单信息
function futureOrderInfoO(o = {}) {
  const instrument_id = getCurFutureInstrumentId(o);
  return {
    instrument_id,
    order_id: o.order_id
  };
}
function futureOrderInfo(res, o) {
  return _formatFutureOrder(res, o);
}
//
function _futurePairs(line) {
  const contract_type = future_id2contract_type(line.instrument_id);
  return {
    instrument_id: line.instrument_id,
    contract_type,
    pair: `${line.underlying_index}-${line.quote_currency}`,
    coin: line.underlying_index,
    tick_size: _parse(line.tick_size),
    contract_value: _parse(line.contract_val),
    open_date: line.listing,
    close_date: line.delivery,
    precision: _parse(line.trade_increment)
  };
}
function futurePairs(res) {
  return _.map(res, _futurePairs);
}

// 期货指数
function futureIndexO(o = {}) {
  const instrument_id = getCurFutureInstrumentId(o);
  return {
    instrument_id,
  };
}
function futureIndex(res, o) {
  return {
    pair: o.pair,
    price: res.index,
    time: new Date(res.timestamp)
  };
}
// 爆仓单信息
const liquidationMap = {
  UNFINISH: 0,
  SUCCESS: 1
};
function futureLiquidationO(o) {
  return {
    instrument_id: getCurFutureInstrumentId(o),
    status: liquidationMap[o.status]
  };
}
function futureLiquidation(res, o) {
  console.log(res, 'res');
}

// 平台持仓
function futureTotalAmountO(o = {}) {
  return {
    instrument_id: getCurFutureInstrumentId(o),
  };
}
function futureTotalAmount(res, o) {
  return {
    unique_id: getFuntureUniqueId(o),
    instrument_id: o.instrument_id,
    ...o,
    amount: _parse(res.amount)
  };
}

function futureTotalHoldAmountO(o = {}) {
  return {
    instrument_id: getCurFutureInstrumentId(o),
  };
}
function getFuntureUniqueId(o) {
  return `${o.pair}_${o.contract_type}`;
}
function futureTotalHoldAmount(res, o) {
  return {
    unique_id: getFuntureUniqueId(o),
    instrument_id: o.instrument_id,
    ...o,
    amount: _parse(res.amount)
  };
}

// 期货k线
function futureKlineO(o = {}) {
  const granularity = intervalMap[o.interval] || 15 * 60;
  const res = { granularity, instrument_id: getCurFutureInstrumentId(o) };
  if (o.timeStart) res.start = o.timeStart.toISOString();
  if (o.timeEnd) res.end = o.timeEnd.toISOString();
  return res;
}
function _formatFutureKline(l, o) {
  const time = new Date(l[0]);
  return {
    ...o,
    unique_id: `${o.pair}_${o.contract_type}_${o.interval}_${time.getTime()}`,
    time,
    open: _parse(l[1]),
    high: _parse(l[2]),
    low: _parse(l[3]),
    close: _parse(l[4]),
    volume_coin: _parse(l[5]),
    volume_amount: _parse(l[6]),
  };
}
function futureKline(res, o) {
  return _.map(res, l => _formatFutureKline(l, o));
}

// 期货限价
function futureLimitPriceO(o = {}) {
  return {
    instrument_id: getCurFutureInstrumentId(o),
  };
}
function futureLimitPrice(res, o) {
  return {
    unique_id: getFuntureUniqueId(o),
    ...o,
    highest_price: _parse(res.highest),
    lowest_price: _parse(res.lowest),
  };
}
function future_id2pair(fid) {
  const arr = fid.split('-');
  arr.pop();
  return `${arr.join('-')}`;
}

function getInfoFromInstrumentId(instrument_id) {
  const pair = future_id2pair(instrument_id);
  const contract_type = future_id2contract_type(instrument_id);
  return {
    id: `${pair}_${contract_type}`,
    contract_type,
    pair,
  };
}
// 行情
function _formatTick(l, o = {}) {
  const { instrument_id } = l;
  const info = getInfoFromInstrumentId(instrument_id);
  return {
    ...info,
    instrument_id,
    last_price: _parse(l.last),
    bid_price: _parse(l.best_bid),
    ask_price: _parse(l.best_ask),
    time: new Date(l.timestamp),
    ...o,
  };
}

function futureTicks(res, o) {
  return _.map(res, d => _formatTick(d, o));
}

function futureTickO(o = {}) {
  const instrument_id = getCurFutureInstrumentId(o);
  return { instrument_id };
}

function setMarginModeO(o) {
  return {
    underlying: o.pair,
    margin_mode: o.margin_mode || o.marginMode
  };
}
function setMarginMode(d) {
  if (d && d.result) {
    const { result, currency: coin, margin_mode } = d;
    if (result) {
      return {
        success: true,
        coin,
        margin_mode
      };
    }
    return null;
  }
  return null;
}


function setLerverate(d) {
  return {
    success: !!d.result,
    margin_mode: d.margin_mode,
    lever_rate: d.leverage,
    pair: d.pair
  };
}

function setLerverateO(o = {}) {
  return {
    underlying: o.pair,
    leverage: o.lever_rate
  };
}

function lerverate(o = {}) {
  const { margin_mode, ...rest } = o;
  const res = [];
  if (margin_mode === 'crossed') {
    const { currency: coin, leverage } = rest;
    res.push({ coin, lever_rate: parseInt(leverage, 10) });
  } else {
    _.forEach(rest, (line, instrument_id) => {
      const info = getInfoFromInstrumentId(instrument_id);
      const l = { ...line, ...info };
      if (line.short_leverage) l.short_lever_rate = line.short_leverage;
      if (line.long_leverage) l.long_lever_rate = line.long_leverage;
      res.push(l);
    });
  }
  return res;
}
function futureTick(res, o) {
  return _formatTick(res, o);
}


function _formatFutureDepth(ds) {
  return _.map(ds, (d) => {
    return {
      price: _parse(d[0]),
      volume_amount: _parse(d[1]),
      liqui_amount: _parse(d[2]),
      count: _parse(d[3])
    };
  });
}

// swap和future
function formatFutureDepth(data, type = 'future') {
  const res = {};
  _.forEach(data, (d) => {
    const { asks, bids, instrument_id, timestamp } = d;
    let info;
    if (type === 'future') {
      info = getInfoFromInstrumentId(instrument_id);
    } else if (type === 'swap') {
      info = {
        instrument_id,
        id: instrument_id,
        pair: instrument_id.replace('-SWAP', '')
      };
    }
    res[`${info.id}`] = {
      ...info,
      exchange: 'okex',
      time: new Date(timestamp),
      bids: _formatFutureDepth(bids),
      asks: _formatFutureDepth(asks)
    };
  }).filter(d => d);
  return _.values(res);
}

const direct = d => d;
module.exports = {
  futureStatusMap,
  formatFutureKline: _formatFutureKline,
  formatFutureDepth,
  getInfoFromInstrumentId,
  getFutureInstrumentId,
  formatBalance: _formatBalance,
  formatFutureBalance: _formatBalance,
  formatFuturePosition: _formatFuturePosition,
  formatFutureOrder: _formatFutureOrder,
  formatContractOrder,
  formatTick: _formatTick,
  //
  futurePositions,
  futurePositionsO: direct,
  futurePosition,
  futurePositionO,
  futureBalancesO,
  futureBalances,
  futureBalanceO,
  futureBalance,
  futureLedgerO,
  futureLedger,
  futureOrderO,
  futureOrder,
  batchCancelFutureOrdersO,
  batchCancelFutureOrders,
  cancelAllFutureOrdersO,
  cancelAllFutureOrders,
  futureOrdersO,
  futureOrders,
  unfinishFutureOrdersO,
  unfinishFutureOrders: futureOrders,
  successFutureOrdersO,
  successFutureOrders: futureOrders,
  futureOrderInfoO,
  futureOrderInfo,
  futurePairsO: direct,
  futurePairs,
  futureIndexO,
  futureIndex,
  futureLiquidationO,
  futureLiquidation,
  futureTotalAmountO,
  futureTotalAmount,
  futureTotalHoldAmountO,
  futureTotalHoldAmount,
  futureLimitPriceO,
  futureLimitPrice,
  futureKline,
  futureKlineO,
  futureTicksO: direct,
  futureTicks,
  futureTickO,
  futureTick,
  setMarginModeO,
  setMarginMode,
  setLerverate,
  setLerverateO,
  lerverate,
  formatFuturePair: _formatPair,
  lerverateO: ({ pair }) => ({ underlying: pair })
};
