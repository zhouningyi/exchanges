const _ = require('lodash');
const Utils = require('./../../../utils');
const ef = require('./../../../utils/formatter');
const md5 = require('md5');
// const moment = require('moment');
const error = require('./../errors');
const { accountTypeMap, getPairInfo, contractStatusMap, rContractStatusMap, getRContractOrderProps, contractOrderPriceTypeMap, getContractOrderProps, getContractOrderType, processContractCancelOrderErrors, processContractCancelOrderSuccesses, formatDotArray } = require('./public');
const { pair2coin, getInstrumentId } = require('./../../../utils/formatter');

const exchange = 'HUOBI';

let future_pairs_detail;
try {
  const _future_pairs_detail = require('./../meta/future_pairs_detail');
  future_pairs_detail = _future_pairs_detail;
} catch (e) {
}

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

function _formatFuturePosition(line, isws) {
  if (!line) return null;
  const coin = line.symbol;
  const res = {
    exchange,
    symbol_id: line.contract_code, // //
    contract_type: line.contract_type, // //
    asset_type: line.contract_type ? line.contract_type.toUpperCase() : null,
    pair: `${coin}-USD`,
    coin,
    long_amount: _parse(line.long_amount) || 0,
    long_benifit: _parse(line.long_benifit) || 0,
    long_locked: _parse(line.long_locked) || 0,
    long_margin: _parse(line.long_margin) || 0,
    long_open_price: _parse(line.long_open_price),
    vector: (line.long_amount || 0) - (line.short_amount || 0),
    short_amount: _parse(line.short_amount) || 0,
    short_benifit: _parse(line.short_benifit) || 0,
    short_locked: _parse(line.short_locked) || 0,
    short_margin: _parse(line.short_margin) || 0,
    short_open_price: _parse(line.short_open_price),
    //
    time: new Date(),
  };
  res.margin = (res.long_margin || 0) + (res.short_margin || 0);
  res.amount = (res.long_amount || 0) + (res.short_amount || 0);
  res.instrument_id = Utils.formatter.getInstrumentId(res);
  const hasPosition = res.sell_amount || res.buy_amount;
  if (hasPosition) {
    res.lever_rate = line.lever_rate;
  }
  return res;
}

function futurePositionsO(o) {
  return {
  };
}

function futurePositions(ds, o, isws) {
  const group = _.groupBy(ds, 'symbol');
  const res = [];
  _.forEach(group, (arr) => {
    const contractTypeGroup = _.groupBy(arr, 'contract_type');
    _.forEach(contractTypeGroup, (l) => {
      const _l = l[0];
      const _res = { ..._l };
      res.push(_res);
      const _group = _.groupBy(l, 'direction');
      const sell = _.get(_group.sell, 0);
      if (sell) {
        _res.short_amount = sell.volume;
        _res.short_benifit = sell.profit;
        _res.short_open_price = sell.cost_open;
        _res.short_margin = sell.position_margin;
        _res.short_locked = sell.frozen;
      }
      //
      const buy = _.get(_group.buy, 0);
      if (_group.buy) {
        _res.long_amount = buy.volume;
        _res.long_benifit = buy.profit;
        _res.long_open_price = buy.cost_open;
        _res.long_margin = buy.position_margin;
        _res.long_locked = buy.frozen;
      }
    });
  });
  let result = _.map(res, d => _formatFuturePosition(d, isws));
  if (o && o.assets) {
    result = ef.fillPositionsByAssets(result, o.assets);
  }
  // console.log('futurePositions...');

  // const btc = _.filter(result, d => d.pair === 'BTC-USD')[0];
  // if (btc) console.log(btc.vector, 'rest position....');

  return result;
}

function futureFeeO(o) {
  if (!o.pair) return {};
  const symbol = o.pair.map(pair => pair.split('-')[0]).join(',');
  return { symbol };
}

function futureFee(res) {
  return _.map(res, (l) => {
    const { symbol: coin, ...rest } = l;
    return {
      coin, ...rest
    };
  });
}

function futureLedgerO(o = {}) {
  const { coin } = o;
  return {
    symbol: coin
  };
}

function _futureLedger(d, o) { // 其实可以把Ledger理解为清算
  return {
    // unique_id: d.ledger_id,
    // ledger_id: d.ledger_id,
    // time: new Date(d.timestamp),
    // coin_amount: _parse(d.amount), // 币的增减
    // amount: _parse(d.balance), // 张数
    // coin: d.currency,
    // type: d.type, // 流水来源 fee 交易手续费 match 交易 liquidation 爆仓 settlement 交割 transfer 转账
    // order_id: _.get(d, 'details.order_id'),
    // instrument_id: _.get(d, 'details.instrument_id'),
    // ...o
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
  const res = `${_formatPair(pair)}-${tstr}`;
  return res;
}

const directionMap = {// /火币在这边是反过来的
  up: 'sell',
  down: 'buy'
};

function futureOrderO(o = {}) {
  const { amount, lever_rate, asset_type, client_oid, price } = o;
  const pair = o.pair.replace('-USDT', '-USD');
  o.direction = o.direction.toLowerCase();
  o.side = o.side.toUpperCase();
  //
  const coin = ef.pair2coin(pair);
  const opt = {
    symbol: coin,
    contract_type: asset_type,
    price,
    volume: amount,
    lever_rate,
    ...getContractOrderProps(o),
    order_price_type: getContractOrderType(o)
  };
  if (client_oid) opt.client_order_id = client_oid;
  return opt;
}

function futureOrder(line, o = {}) {
  if (!line) return false;
  const order_id = line.order_id_str || (line.order_id ? `${line.order_id}` : null);
  if (!order_id) return false;
  const res = {
    unique_id: `futureOrder_${order_id}`,
    order_id,
    status: 'UNFINISH',
    ...o
  };
  if (line.client_order_id)res.client_oid = line.client_order_id;
  line.instrument_id = ef.getInstrumentId(line);

  return res;
}
// 返回所有订单信息


// 订单报价类型 "limit":限价 "opponent":对手价 "post_only":只做maker单,post only下单只受用户持仓数量限制,optimal_5：最优5档、optimal_10：最优10档、optimal_20：最优20档

// const rDirectionMap = {
//   buy: 'UP',
//   sell: 'DOWN'
// };
// const rOffsetMap = {
//   open: 'BUY',
//   close: 'SELL'
// };


// 0:全部,3:未成交, 4: 部分成交,5: 部分成交已撤单,6: 全部成交,7:已撤单


function _formatFutureOrder(l, o) {
  const { status, symbol: coin, trade, profit, price, lever_rate, volume: amount, create_date, created_at, contract_type, order_source, offset, trade_volume: deal_amount, order_price_type, fee } = l;
  const ct = create_date || created_at;
  const order_id = l.order_id_str || `${l.order_id}`;
  const res = {
    coin,
    pair: `${coin}-USD`,
    unique_id: coin + contract_type + order_id,
    contract_type,
    asset_type: contract_type.toUpperCase(),
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
    status: rContractStatusMap[status],
    trade
  };
  if (l.client_order_id) res.client_oid = `${l.client_order_id}`;
  res.instrument_id = ef.getInstrumentId(res);
  return res;
}


function futureOrdersO(o = {}) {
  const { status = 'ALL', page_size = 50 } = o;
  const opt = {
    symbol: o.pair.split('-')[0],
    trade_type: 0,
    type: 1,
    status: contractStatusMap[status],
    create_date: 7,
    page_size
  };
  // console.log(status, 'status....');
  // if (status === 'ALL')console.log(opt, 'opt....');
  return opt;
}
function futureOrders(ds, o) {
  if (!ds) return false;
  const { orders } = ds;
  if (!orders) return false;
  const res = _.map(orders, _formatFutureOrder);
  // console.log(o, `futureOrders/${_.get(res, 'length')}`);
  return res;
}


function futureOrderInfoO(o = {}) {
  const symbol = _pair2coin(o.pair);
  const res = {
    symbol
  };
  if (o.order_id) res.order_id = formatDotArray(o.order_id);
  if (o.client_oid) res.client_order_id = formatDotArray(o.client_oid);
  return res;
}
function futureOrderInfo(res, o) {
  if (!res || res.error) return false;
  res = _.map(res, d => _formatFutureOrder(d, o));
  if (res && res.length === 1) res = res[0];
  return res;
}
//
function _futurePairs(line) {
  const { symbol, contract_code, contract_type, contract_size, price_tick, delivery_date } = line;
  return {
    symbol_id: contract_code,
    contract_type,
    pair: `${symbol}-USD`,
    coin: symbol,
    tick_size: _parse(price_tick),
    contract_value: _parse(contract_size),
    close_date: delivery_date,
  };
}

function getDefaultFuturePairs() {
  return _.keys(futureInfoMap);
}

const futureInfoMap = {};

function updateFutureInfoMap(res) {
  _.forEach(res, (d) => {
    _.set(futureInfoMap, `${d.pair}.${d.contract_type}`, d);
  });
}
updateFutureInfoMap(future_pairs_detail);

function futurePairs(res) {
  res = _.map(res, _futurePairs);
  updateFutureInfoMap(res);
  return res;
}

// // 期货指数
function futureIndexO(o = {}) {
  const pairs = o.pairs || getDefaultFuturePairs();
  const symbol = _.map(pairs, p => p.split('-')[0]).join(',');
  return {
    symbol
  };
}
function futureIndex(res, o) {
  return _.map(res, (d) => {
    return {
      coin: d.symbol,
      pair: `${d.symbol}-USDT`,
      price: _parse(d.index_price),
      time: new Date(d.index_ts)
    };
  });
}

// 平台持仓
function futureTotalAmounts(res, o) {
  return _.map(res, (d) => {
    return {
      coin: d.symbol,
      pair: `${d.symbol}-USD`,
      unique_id: d.contract_code,
      contract_type: d.contract_type,
      amount: _parse(d.volume),
    };
  });
}

function futureRiskInfo(res) {
  return _.map(res, (d) => {
    return {
      coin: d.symbol,
      pair: `${d.symbol}-USD`,
      insurance_amount: d.insurance_fund,
      estimated_clawback: d.estimated_clawback
    };
  });
}

function _formatBalance(line) {
  const coin = line.symbol.toUpperCase();
  const res = {
    exchange,
    coin,
    pair: `${coin}-USD`,
    asset_type: 'FUTURE',
    account_rights: _parse(line.margin_balance),
    balance: _parse(line.margin_balance),
    risk_rate: _parse(line.risk_rate), // 保证金率
    lever_rate: _parse(line.lever_rate),
    profit_real: _parse(line.profit_real),
    profit_unreal: _parse(line.profit_unreal),
    withdraw_available: _parse(line.withdraw_available),
    adjust_factor: _parse(line.adjust_factor),
    margin_used: _parse(line.margin_position),
    margin: _parse(line.margin || line.margin_position),
    liquidation_price: _parse(line.liquidation_price),
    time: new Date()
  };
  res.balance_id = Utils.formatter.getBalanceId(res);
  return cleanObjectNull(res);
}

function futureBalances(res) {
  res = _.map(res, _formatBalance);
  // const btc = _.get(_.filter(res, d => d.coin === 'BTC'), '0.balance');
  // if (btc) {
  //   console.log(btc, 'future rest...');
  // } else {
  //   // console.log(res, 'futureBalances no btc...');
  // }
  return res;
}

function _pair2coin(pair) {
  return pair.split('-')[0];
}
function cancelAllFutureOrdersO(o) {
  const symbol = _pair2coin(o.pair);
  const res = {
    symbol
  };
  if (o.contract_type) res.contract_type = o.contract_type;
  if (o.contract_code) res.contract_type = o.contract_code;
  return res;
}

function cancelAllFutureOrders(res) {
  if (!res.successes) return false;
  return res.successes.split(',').map((order_id) => {
    order_id = `${order_id}`;
    return {
      unique_id: `futureOrder_${order_id}`,
      order_id,
      status: 'CANCEL'
    };
  });
}

function futureMoveBalanceO(o) {
  const { source, target, coin, amount } = o;
  const opt = {
    currency: coin.toLowerCase(),
    amount
  };
  if (source === 'SPOT' && target === 'FUTURE') {
    opt.type = 'pro-to-futures';
  } else if (source === 'FUTURE' && target === 'SPOT') {
    opt.type = 'futures-to-pro';
  }
  return opt;
}
function futureMoveBalance(res, o) {
  if (typeof res === 'number' || typeof res === 'string') return { success: true, txid: `${res}`, ...o };
  return false;
}

function _formatFutureDepth(ds) {
  return _.map(ds, (d) => {
    return {
      price: _parse(d[0]),
      volume: _parse(d[1]),
    };
  });
}

function batchCancelFutureOrdersO(o = {}) {
  let { order_id, pair } = o;
  const res = { symbol: _pair2coin(pair) };
  if (order_id) {
    if (Array.isArray(order_id)) order_id = order_id.join(',');
    res.order_id = order_id;
  }
  return res;
}

// errors: [
//   {
//     order_id: '1818307157179392',
//     err_code: 1061,
//     err_msg: 'This order doesnt exist.'
//   }
// ],

function batchCancelFutureOrders(res) {
  if (res && res.successes) {
    if (typeof res.successes === 'string') {
      res.successes = res.successes.split(',').map(order_id => ({ order_id }));
    }
    return res.successes;
  }
  return [];
}

// /


function futureCancelOrderO(o) {
  const { pair } = o;
  const opt = { symbol: ef.pair2coin(pair).toLowerCase() };
  if (o.order_id) opt.order_id = `${o.order_id}`;
  if (o.client_oid) opt.client_order_id = `${o.client_oid}`;
  return opt;
}

function futureCancelOrder(res, o) {
  return [...processContractCancelOrderErrors(res, o), ...processContractCancelOrderSuccesses(res, o)].filter(d => d)[0];
}


function futureAssets(ds) {
  return _.map(ds, (d) => {
    const res = {
      exchange,
      pair: `${d.symbol}-USD`,
      contract_code: d.contract_code,
      asset_type: d.contract_type.toUpperCase(),
      contract_size: _parse(d.contract_size),
      isable: d.contract_status === 1,
      price_precision: d.price_tick
    };
    res.instrument_id = Utils.formatter.getInstrumentId(res);
    return res;
  });
}

function futureUnfinishOrdersO(o = {}) {
  return { symbol: pair2coin(o.pair) };
}

function futureUpdateLeverateO(o = {}) {
  const coin = ef.getCoin(o);
  const { lever_rate } = o;
  return { symbol: coin, lever_rate };
}

function futureUpdateLeverate(res, o) {
  if (!res) return null;
  const { lever_rate } = res;
  return { ...o, lever_rate };
}


function futureOrderDetailsO(o = {}) {
  return { symbol: pair2coin(o.pair), trade_type: 0, create_date: 1 };
}

function _formatOrderDetail(d, o) {
  const res = {
    exchange,
    unique_id: `${d.match_id}`,
    order_id: `${d.order_id_str}`,
    pair: `${o.pair}`,
    asset_type: d.contract_type.toUpperCase(),
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
function futureOrderDetails(ds, o) {
  return _.map(ds.trades, d => _formatOrderDetail(d, o));
}

module.exports = {
  futureOrderDetailsO,
  futureOrderDetails,
  futureUpdateLeverateO,
  futureUpdateLeverate,
  futureAssets,
  futureCancelOrderO,
  futureCancelOrder,
  getDefaultFuturePairs,
  futureRiskInfo,
  formatFutureDepth: _formatFutureDepth,
  futureBalances,
  futureBalance: futureBalances,
  // // formatFutureDepth,
  // getInfoFromInstrumentId,
  // getFutureInstrumentId,
  // formatBalance: _formatBalance,
  // formatFuturePosition: _formatFuturePosition,
  formatFutureOrder: _formatFutureOrder,
  // formatTick: _formatTick,
  // //
  // futurePositions,
  futurePositionsO,
  // futurePosition,
  futurePositions,
  futureFeeO,
  futureFee,
  // futurePositionO,
  // futureBalancesO,
  // futureBalances,
  // futureBalanceO,
  // futureBalance,
  futureMoveBalanceO,
  futureMoveBalance,
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
  futureUnfinishOrdersO,
  futureUnfinishOrders: futureOrders,
  // successFutureOrdersO,
  // successFutureOrders: futureOrders,
  futureOrderInfoO,
  futureOrderInfo,
  // futurePairsO: direct,
  futureIndexO,
  futureIndex,
  // futureLiquidationO,
  // futureLiquidation,
  // futureTotalAmountO,
  futureTotalAmounts,
  // futureTotalHoldAmountO,
  // futureTotalHoldAmount,
  // futureLimitPriceO,
  // futureLimitPrice,
  // futureTicksO: direct,
  // futureTicks,
  // futureTickO,
  // futureTick,
  // setLerverate,
  // setLerverateO,
  // lerverate,
  // lerverateO: direct
};
