const _ = require('lodash');
const Utils = require('./../../../utils');
const md5 = require('md5');
// const moment = require('moment');
const error = require('./../errors');
const { accountTypeMap } = require('./public');

const { checkKey, throwError, cleanObjectNull } = Utils;


// function

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
  const tstr = `20${year}-${month}-${day}`;
  const dt = new Date(tstr) - new Date();
  if (dt > d14) return 'quarter';
  if (dt > d7) return 'next_week';
  return 'this_week';
}

function _formatFuturePosition(line) {
  if (!line || !line.margin_mode) return null;
  const pair = future_id2pair(line.instrument_id);
  const coin = pair.toUpperCase().split('-USD')[0];
  return {
    margin_mode: line.margin_mode,
    liquidation_price: _parse(line.liquidation_price),
    buy_liqu_price: _parse(line.long_liqui_price),
    buy_margin: _parse(line.long_margin),
    buy_amount: _parse(line.long_qty),
    buy_avaliable_amount: _parse(line.long_avail_qty), // 多仓可以平仓数量
    buy_price_avg: _parse(line.long_avg_cost), // 多仓平均开仓价
    buy_settlement_price: _parse(line.long_settlement_price),
    benifit: _parse(line.realized_pnl),
    sell_liqu_price: _parse(line.short_liqui_price),
    sell_margin: _parse(line.short_margin),
    sell_amount: _parse(line.short_qty),
    sell_avaliable_amount: _parse(line.short_avail_qty), // 多仓可以平仓数量
    sell_price_avg: _parse(line.short_avg_cost), // 多仓平均开仓价
    sell_settlement_price: _parse(line.short_settlement_price),
    instrument_id: line.instrument_id,
    pair,
    coin,
    contract_type: future_id2contract_type(line.instrument_id),
    lever_rate: _parse(line.leverage),
    long_leverage: _parse(line.long_leverage),
    short_leverage: _parse(line.short_leverage),
    time: line.created_at,
  };
}


function futurePosition(ds) {
  if (!ds || !ds.result) throwError('futurePosition 返回错误');
  return _.map(_.flatten(ds.holding), _formatFuturePosition);
}

// /
function _formatBalance(line, coin) {
  coin = coin.toUpperCase();
  return cleanObjectNull({
    coin,
    pair: `${coin}-USDT`,
    margin_mode: line.margin_mode,
    account_rights: _parse(line.equity),
    margin_ratio: _parse(line.margin_ratio), // 保证金率
    profit_real: _parse(line.realized_pnl),
    profit_unreal: _parse(line.unrealized_pnl),
    margin: _parse(line.margin),
    balance: _parse(line.total_avail_balance), //	账户余额
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
  if (!pair) return false;
  return pair.toUpperCase().replace('-USDT', '-USD');
}

function getFutureInstrumentId(pair, contract_type, t = new Date()) {
  const date = Utils.getFutureSettlementDay(t, contract_type);
  const tstr = date.split('-').join('').substring(2);
  return `${_formatPair(pair)}-${tstr}`;
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
function futureOrderO(o = {}) {
  const { amount, lever_rate } = o;
  const direction = o.direction.toUpperCase();
  const side = o.side.toUpperCase();
  const type = o.type.toUpperCase();
  const instrument_id = getCurFutureInstrumentId(o);
  return {
    instrument_id,
    ..._.pick(o, ['price', 'client_oid']),
    size: amount,
    type: _.get(futureTypeMap, `${side}.${direction}`),
    match_price: type === 'LIMIT' ? 0 : 1, // 对手价
    leverage: lever_rate,
  };
}
function futureOrder(line, o = {}) {
  if (!line || !line.result) return false;
  return {
    client_oid: line.client_oid,
    order_id: line.order_id,
    error: line.error_message,
    success: line.result,
    status: 'UNFINISH',
    time: new Date(),
    ...o
  };
}
// 撤销订单
function cancelFutureOrderO(o = {}) {
  const { order_id } = o;
  const instrument_id = getCurFutureInstrumentId(o);
  return { instrument_id, order_id };
}
function cancelFutureOrder(line, o) {
  if (!line) return false;
  return {
    client_oid: line.client_oid,
    status: 'CANCEL',
    time: new Date(),
    ...o
  };
}
// 批撤销订单
function cancelAllFutureOrdersO(o = {}) {
  const { order_ids } = o;
  const instrument_id = getCurFutureInstrumentId(o);
  return { instrument_id, order_ids };
}
function cancelAllFutureOrders(res, o) {
  if (!res || !res.result) return false;
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
  UNFINISH: 0,
  PARTIAL: 1,
  SUCCESS: 2,
  CANCELLING: 3,
  CANCEL: -1
};

function _formatFutureOrder(l, o) {
  const info = getInfoFromInstrumentId(l.instrument_id);
  return {
    ...info,
    instrument_id: l.instrument_id,
    amount: _parse(l.size),
    filled_amount: _parse(l.filled_qty),
    fee: _parse(l.fee),
    price: _parse(l.price),
    price_avg: _parse(l.price_avg),
    lever_rate: _parse(l.leverage),
    time: new Date(l.timestamp),
    order_id: l.order_id,
    client_oid: l.client_oid,
    status: code2Side[l.type],
    direction: code2Direction[l.type],
    ...o,
  };
}

function futureOrdersO(o = {}) {
  const instrument_id = getCurFutureInstrumentId(o);
  return {
    instrument_id,
    status: futureStatusMap[o.status],
    from: o.from,
    to: o.to,
    limit: o.limit
  };
}
function futureOrders(ds, o) {
  if (!ds || !ds.result) return false;
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
  return `${arr.join('-')}T`;
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
  formatFutureDepth,
  getInfoFromInstrumentId,
  getFutureInstrumentId,
  formatBalance: _formatBalance,
  formatFuturePosition: _formatFuturePosition,
  formatFutureOrder: _formatFutureOrder,
  formatTick: _formatTick,
  //
  futurePosition,
  futurePositionO: direct,
  futureBalancesO,
  futureBalances,
  futureBalanceO,
  futureBalance,
  futureLedgerO,
  futureLedger,
  futureOrderO,
  futureOrder,
  cancelFutureOrderO,
  cancelFutureOrder,
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
  futureTicksO: direct,
  futureTicks,
  futureTickO,
  futureTick
};
