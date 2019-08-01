const _ = require('lodash');
const Utils = require('./../../../utils');
const md5 = require('md5');
// const moment = require('moment');
const error = require('./../errors');
const { accountTypeMap } = require('./public');

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

function _formatFuturePosition(line) {
  if (!line) return null;
  const coin = line.symbol;
  return {
    instrument_id: line.contract_code, // //
    contract_type: line.contract_type, // //
    pair: `${coin}-USD`,
    lever_rate: line.lever_rate,
    coin,
    buy_amount: _parse(line.buy_amount),
    buy_benifit: _parse(line.buy_benifit),
    buy_locked: _parse(line.buy_locked),
    buy_margin: _parse(line.buy_margin),
    buy_open_price: _parse(line.buy_open_price),

    sell_amount: _parse(line.sell_amount),
    sell_benifit: _parse(line.sell_benifit),
    sell_locked: _parse(line.sell_locked),
    sell_margin: _parse(line.sell_margin),
    sell_open_price: _parse(line.sell_open_price),
    //
    time: new Date(),
  };
}

function futurePositions(ds) {
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
        _res.sell_amount = sell.volume;
        _res.sell_benifit = sell.profit;
        _res.sell_open_price = sell.cost_open;
        _res.sell_margin = sell.position_margin;
        _res.sell_locked = sell.frozen;
      }
      //
      const buy = _.get(_group.buy, 0);
      if (_group.buy) {
        _res.buy_amount = buy.volume;
        _res.buy_benifit = buy.profit;
        _res.buy_open_price = buy.cost_open;
        _res.buy_margin = buy.position_margin;
        _res.buy_locked = buy.frozen;
      }
    });
  });
  return _.map(res, _formatFuturePosition);
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
  console.log(d, 'futureLedger...');
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

const directionMap = {
  up: 'buy',
  down: 'sell'
};

function futureOrderO(o = {}) {
  const { amount, lever_rate, contract_type, client_oid, price } = o;
  const pair = o.pair.replace('-USDT', '-USD');
  const direction = o.direction.toLowerCase();
  const side = o.side.toUpperCase();
  const offset = side === 'BUY' ? 'open' : 'close';
  //
  const coin = pair.split('-')[0];
  const opt = {
    symbol: coin,
    contract_type,
    price,
    volume: amount,
    offset,
    lever_rate,
    direction: directionMap[direction],
    order_price_type: 'limit'
  };
  if (client_oid) o.client_order_id = client_oid;
  return opt;
}
function futureOrder(line, o = {}) {
  if (!line) return false;
  const order_id = `${line.order_id}`;
  if (!order_id) return false;
  return {
    unique_id: `futureOrder_${order_id}`,
    order_id,
    status: 'NO_RETURN',
    ...o
  };
}
// 返回所有订单信息
const futureStatusMap = {
  UNFINISH: 0,
  PARTIAL: 1,
  SUCCESS: 2,
  CANCELLING: 3,
  CANCEL: -1
};


// 订单报价类型 "limit":限价 "opponent":对手价 "post_only":只做maker单,post only下单只受用户持仓数量限制,optimal_5：最优5档、optimal_10：最优10档、optimal_20：最优20档
const orderPriceTypMap = {
  limit: 'LIMIT',
  opponent: 'OPPONENT',
  lightning: 'LIGHTNING',
  post_only: 'MAKER_ONLY'
};

const rDirectionMap = {
  buy: 'UP',
  sell: 'DOWN'
};
const rOffsetMap = {
  open: 'BUY',
  close: 'SELL'
};

// 0:全部,3:未成交, 4: 部分成交,5: 部分成交已撤单,6: 全部成交,7:已撤单

const statusMap = {
  ALL: 0,
  UNFINISH: 3,
  PARTIAL: 4,
  CANCELLING: 5,
  SUCCESS: 6,
  CANCEL: 7
};
const rStatusMap = _.invert(statusMap);
function _formatFutureOrder(l, o) {
  const { status, symbol: coin, trade, profit, direction, price, lever_rate, volume: amount, create_date, created_at, contract_type, order_source, offset, trade_volume: deal_amount, order_price_type, fee } = l;
  const ct = create_date || created_at;
  const order_id = `${l.order_id}`;
  return {
    coin,
    pair: `${coin}-USDT`,
    direction: rDirectionMap[direction],
    unique_id: coin + contract_type + order_id,
    contract_type,
    order_id,
    order_source,
    benifit: profit,
    lever_rate,
    type: orderPriceTypMap[order_price_type],
    amount: _parse(amount),
    price: _parse(price),
    deal_amount,
    fee: _parse(fee),
    side: rOffsetMap[offset],
    server_created_at: ct ? new Date(ct) : undefined,
    status: rStatusMap[status],
    trade
  };
}


function futureOrdersO(o = {}) {
  const { status = 'ALL', page_size = 50 } = o;
  return {
    symbol: o.pair.split('-')[0],
    trade_type: 0,
    type: 1,
    status: statusMap[status],
    create_date: 7,
    page_size
  };
}
function futureOrders(ds, o) {
  if (!ds) return false;
  const { orders } = ds;
  if (!orders) return false;
  return _.map(orders, _formatFutureOrder);
}

function unfinishFutureOrdersO(o = {}) {
  const symbol = o.pair.split('-')[0];
  // console.log(symbol, 'unfinishFutureOrdersO...');
  return { symbol };
}

// 返回单个订单信息
function _formatDotArray(v) {
  if (Array.isArray(v)) return v.join(',');
  return `${v}`;
}
function futureOrderInfoO(o = {}) {
  const symbol = _pair2coin(o.pair);
  const res = {
    symbol
  };
  if (o.order_id) res.order_id = _formatDotArray(o.order_id);
  if (o.client_oid) res.client_order_id = _formatDotArray(o.client_oid);
  return res;
}
function futureOrderInfo(res, o) {
  if (!res || res.error) return false;
  return _.map(res, d => _formatFutureOrder(d, o));// (, o);
}
//
function _futurePairs(line) {
  const { symbol, contract_code, contract_type, contract_size, price_tick, delivery_date } = line;
  return {
    instrument_id: contract_code,
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
  return cleanObjectNull({
    coin,
    pair: `${coin}-USD`,
    account_rights: _parse(line.margin_balance),
    risk_rate: _parse(line.risk_rate), // 保证金率
    lever_rate: _parse(line.lever_rate),
    profit_real: _parse(line.profit_real),
    profit_unreal: _parse(line.profit_unreal),
    withdraw_available: _parse(line.withdraw_available),
    adjust_factor: _parse(line.adjust_factor),
    margin_used: _parse(line.margin_position),
    margin: _parse(line.margin || line.margin_position),
    // balance: _parse(line.total_avail_balance),
    liquidation_price: _parse(line.liquidation_price),
    time: new Date()
  });
}

function futureBalances(res) {
  return _.map(res, _formatBalance);
}

// function futureTotalHoldAmountO(o = {}) {
//   return {
//     instrument_id: getCurFutureInstrumentId(o),
//   };
// }
// function getFuntureUniqueId(o) {
//   return `${o.pair}_${o.contract_type}`;
// }
// function futureTotalHoldAmount(res, o) {
//   return {
//     unique_id: getFuntureUniqueId(o),
//     instrument_id: o.instrument_id,
//     ...o,
//     amount: _parse(res.amount)
//   };
// }

// // 期货限价
// function futureLimitPriceO(o = {}) {
//   return {
//     instrument_id: getCurFutureInstrumentId(o),
//   };
// }
// function futureLimitPrice(res, o) {
//   return {
//     unique_id: getFuntureUniqueId(o),
//     ...o,
//     highest_price: _parse(res.highest),
//     lowest_price: _parse(res.lowest),
//   };
// }
// function future_id2pair(fid) {
//   const arr = fid.split('-');
//   arr.pop();
//   return `${arr.join('-')}T`;
// }

// function getInfoFromInstrumentId(instrument_id) {
//   const pair = future_id2pair(instrument_id);
//   const contract_type = future_id2contract_type(instrument_id);
//   return {
//     id: `${pair}_${contract_type}`,
//     contract_type,
//     pair,
//   };
// }
// // 行情
// function _formatTick(l, o = {}) {
//   const { instrument_id } = l;
//   const info = getInfoFromInstrumentId(instrument_id);
//   return {
//     ...info,
//     instrument_id,
//     last_price: _parse(l.last),
//     bid_price: _parse(l.best_bid),
//     ask_price: _parse(l.best_ask),
//     time: new Date(l.timestamp),
//     ...o,
//   };
// }

// function futureTicks(res, o) {
//   return _.map(res, d => _formatTick(d, o));
// }

// function futureTickO(o = {}) {
//   const instrument_id = getCurFutureInstrumentId(o);
//   return { instrument_id };
// }

// function setLerverate(d) {
//   return {
//     success: !!d.result,
//     margin_mode: d.margin_mode,
//     lever_rate: d.leverage,
//     coin: d.currency
//   };
// }

// function setLerverateO(o = {}) {
//   return {
//     coin: o.coin,
//     leverage: o.lever_rate
//   };
// }


// function _formatFutureDepth(ds) {
//   return _.map(ds, (d) => {
//     return {
//       price: _parse(d[0]),
//       volume_amount: _parse(d[1]),
//       liqui_amount: _parse(d[2]),
//       count: _parse(d[3])
//     };
//   });
// }

// // swap和future
// function formatFutureDepth(data, type = 'future') {
//   const res = {};
//   _.forEach(data, (d) => {
//     const { asks, bids, instrument_id, timestamp } = d;
//     let info;
//     if (type === 'future') {
//       info = getInfoFromInstrumentId(instrument_id);
//     } else if (type === 'swap') {
//       info = {
//         instrument_id,
//         id: instrument_id,
//         pair: instrument_id.replace('-SWAP', '')
//       };
//     }
//     res[`${info.id}`] = {
//       ...info,
//       exchange: 'okex',
//       time: new Date(timestamp),
//       bids: _formatFutureDepth(bids),
//       asks: _formatFutureDepth(asks)
//     };
//   }).filter(d => d);
//   return _.values(res);
// }

// const direct = d => d;

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

function spotFutureTransferO(o) {
  const { source, target, coin, amount } = o;
  const opt = {
    currency: coin.toLowerCase(),
    amount
  };
  if (source === 'spot' && target === 'future') {
    opt.type = 'pro-to-futures';
  } else if (source === 'future' && target === 'spot') {
    opt.type = 'futures-to-pro';
  }
  return opt;
}
function spotFutureTransfer(res, o) {
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
  console.log(res, 22331);
  return res;
}

function batchCancelFutureOrders(res) {
  console.log(res);
}
module.exports = {
  getDefaultFuturePairs,
  futureRiskInfo,
  formatFutureDepth: _formatFutureDepth,
  futureBalances,
  // // formatFutureDepth,
  // getInfoFromInstrumentId,
  // getFutureInstrumentId,
  // formatBalance: _formatBalance,
  // formatFuturePosition: _formatFuturePosition,
  formatFutureOrder: _formatFutureOrder,
  // formatTick: _formatTick,
  // //
  // futurePositions,
  // futurePositionsO: direct,
  // futurePosition,
  futurePositions,
  futureFeeO,
  futureFee,
  // futurePositionO,
  // futureBalancesO,
  // futureBalances,
  // futureBalanceO,
  // futureBalance,
  spotFutureTransferO,
  spotFutureTransfer,
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
  // successFutureOrdersO,
  // successFutureOrders: futureOrders,
  futureOrderInfoO,
  futureOrderInfo,
  // futurePairsO: direct,
  futurePairs,
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
