const _ = require('lodash');
const Utils = require('./../../../utils');
const md5 = require('md5');
// const moment = require('moment');
const error = require('./../errors');
const { accountTypeMap } = require('./public');

const { checkKey, throwError } = Utils;


// function

const _parse = Utils._parse;

function future_id2pair(instrument_id) {
  const arr = instrument_id.split('-');
  return `${`${arr[0]}-${arr[1]}`}T`;
}

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

function getFutureId(pair, contract_id, t) {
  const now = t ? new Date(t) : new Date();
}

function _formatFuturePosition(line) {
  return {
    margin_mode: line.margin_mode,
    force_liqu_price: _parse(line.liquidation_price),
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
    pair: future_id2pair(line.instrument_id),
    contract_type: future_id2contract_type(line.instrument_id),
    lever_rate: _parse(line.leverage),
    time: line.created_at,
  };
}


function futurePositionO(o = {}) {
  return o;
}

function futurePosition(ds) {
  if (!ds || !ds.result) throwError('futurePosition 返回错误');
  return _.map(_.flatten(ds.holding), _formatFuturePosition);
}

// /

function _formatBalance(line, coin) {
  coin = coin.toUpperCase();
  return {
    pair: `${coin}-USDT`,
    margin_mode: line.margin_mode,
    account_rights: _parse(line.equity),
    margin_ratio: _parse(line.margin_ratio), // 保证金率
    profit_real: _parse(line.realized_pnl),
    profit_unreal: _parse(line.unrealized_pnl),
    margin: _parse(line.margin),
    balance: _parse(line.total_avail_balance), //	账户余额
  };
}

function futureBalancesO(o = {}) {
  return o;
}

function futureBalances(ds) {
  const info = _.get(ds, 'info');
  return _.map(info, _formatBalance);
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

function getFutureInstrumentId(pair, contract_type) {
  return `${_formatPair(pair)}-${t}`;
}

function formatOrderO(o = {}) {
  return {
  };
}
function formatOrder(ds, o = {}) {
}

module.exports = {
  futurePosition,
  futurePositionO,
  futureBalancesO,
  futureBalances,
  futureLedgerO,
  futureLedger,
  formatOrderO,
  formatOrder
};
