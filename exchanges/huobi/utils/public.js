const _ = require('lodash');
const md5 = require('md5');

const Utils = require('./../../../utils');
const config = require('./../config');
const pairsRaw = require('./../meta/pairs.json');

const { checkKey } = Utils;

// function _parse(v) {
//   return parseFloat(v, 10);
// }

// function createWsChanel(genChanel) {
//   return (pairs, o) => {
//     const ds = [];
//     _.forEach(pairs, (pair) => {
//       const channel = genChanel(pair, o);
//       if (Array.isArray(channel)) {
//         _.forEach(channel, (chan) => {
//           ds.push({ event: 'addChannel', channel: chan });
//         });
//       } else if (typeof channel === 'string') {
//         ds.push({ event: 'addChannel', channel });
//       }
//     });
//     return JSON.stringify(ds);
//   };
// }

// const intervalMap = {
//   '1m': '1min',
//   '3m': '3min',
//   '15m': '15min',
//   '1h': '1hour',
//   '2h': '2hour',
//   '4h': '4hour',
//   '6h': '6hour',
//   '12h': '12hour',
//   '1d': '1day',
//   '3d': '2hour',
// };

// function parseOrderType(typeStr) {
//   const ts = typeStr.toUpperCase().split('_');
//   const side = ts[0];
//   const type = ts[1] || 'LIMIT';
//   return { type, side };
// }

// function formatInterval(iter) {
//   iter = iter.toLowerCase();
//   const it = intervalMap[iter];
//   if (!it) {
//     console.log(`okex 的kline图没有时间周期${iter}`);
//     process.exit();
//   }
//   return it;
// }

// function formatWsResult(_format) {
//   let result = {};
//   return (ds) => {
//     _.forEach(ds, (d) => {
//       const { channel } = d;
//       d = d.data;
//       if (d.result) return null;
//       result = { ...result, ..._format(d, channel) };
//     });
//     return result;
//   };
// }

// function extactPairFromFutureChannel(channel, str) {  // usd_btc_kline_quarter_1min
//   const symbol = channel.replace('ok_sub_future', '').split(str)[0];
//   return symbol2pair(symbol, true);
// }

// function extactPairFromSpotChannel(channel, str) {
//   const symbol = channel.replace('ok_sub_spot_', '').split(str)[0];
//   return symbol2pair(symbol, false);
// }

// const code2OrderStatus = {
//   '-1': 'CANCEL',
//   0: 'UNFINISH',
//   1: 'PARTIAL',
//   2: 'SUCCESS',
//   3: 'CANCELLING'
// };
// const orderStatus2Code = _.invert(code2OrderStatus);

// const code2FutureOrderStatus = {
//   1: 'UNFINISH',
//   2: 'SUCCESS'
// };

// const futureOrderStatus2Code = _.invert(code2FutureOrderStatus);

// function pair2coin(pair) {
//   return pair.split('-')[0].toUpperCase();
// }
// function coin2pair(coin) {
//   return (`${coin}-USDT`).toUpperCase();
// }

// const accountTypeMap = {
//   sub_account: 0,
//   spot: 1,
//   future: 3,
//   c2c: 4,
//   margin: 5,
//   wallet: 6,
//   ETT: 7
// };

function direct(d) {
  return d;
}

// const accountTypeMapInvert = _.invert(accountTypeMap);

// ////////////

// move Balance


// // 提币历史
// function withdrawHistoryO(o = {}) {
//   return o;
// }

// function _formatWithDrawHistory(d) {
//   const { fee, amount, timestamp, from: source, to: target, txid, tag, currency: coin, payment_id } = d;
//   const time = new Date(timestamp);
//   return { unique_id: md5(`${time.getTime()}_${coin}_${source}_${target}`), txid, tag, payment_id, time, fee, amount, coin, source, target };
// }
// function withdrawHistory(ds, o) {
//   return _.map(ds, _formatWithDrawHistory);
// }

// // 流水
// const ledgerMap = {
//   1: '充值',
//   2: '提现',
//   13: '撤销提现',
//   18: '转入合约账户',
//   19: '合约账户转出',
//   20: '转入子账户',
//   21: '子账户转出',
//   28: '领取',
//   29: '转入指数交易区',
//   30: '指数交易区转出',
//   31: '转入点对点账户',
//   32: '点对点账户转出',
//   33: '转入币币杠杆账户',
//   34: '币币杠杆账户转出',
//   37: '转入币币账户',
//   38: '币币账户转出',
// };

// const rLedgerMap = _.invert(ledgerMap);

// function walletLedgerO(o) {
//   const defaultO = { limit: 100 };
//   o = { ...defaultO, ...o };
//   const opt = {
//     limit: o.limit
//   };
//   if (o.type) opt.type = accountTypeMap[o.type];
//   if (o.from) opt.from = rLedgerMap[o.source];
//   if (o.to) opt.to = rLedgerMap[o.to];
//   return opt;
// }

// const execTypeMap = {
//   T: 'TAKER',
//   M: 'MAKER'
// };
// function _formatLedger(d, o = {}) {
//   const amount = d.size || d.amount;
//   return {
//     ...o,
//     unique_id: d.ledger_id,
//     ledger_id: d.ledger_id,
//     instrument_id: d.instrument_id,
//     exec_type: execTypeMap[d.exec_type],
//     price: d.price !== undefined ? _parse(d.price) : undefined,
//     coin: d.currency,
//     type: d.typeName || d.type || d.typename,
//     amount: amount !== undefined ? _parse(amount) : undefined,
//     fee: d.fee !== undefined ? _parse(d.fee) : undefined,
//     balance: d.balance !== undefined ? _parse(d.balance) : undefined,
//     pair: _.get(d, 'details.product_id') || d.product_id,
//     order_id: _.get(d, 'details.order_id'),
//     side: d.side ? d.side.toUpperCase() : undefined,
//     // source: accountTypeMapInvert[d.from],
//     // target: accountTypeMapInvert[d.to],
//     time: new Date(d.timestamp)
//   };
// }

// function parseTypeName(typeName) {
//   if (typeName.indexOf('Get from activity') !== -1) return { action_type: 'IN', reference_account_type: 'okex' };
//   if (typeName.indexOf('Deposit') !== -1) return { action_type: 'IN', reference_account_type: 'other_account' };
//   if (typeName.indexOf('withdrawal') !== -1) return { action_type: 'OUT', reference_account_type: 'other_account' };
//   if (typeName.indexOf('To: margin account') !== -1) return { action_type: 'OUT', reference_account_type: 'margin' };
//   if (typeName.indexOf('From: margin account') !== -1) return { action_type: 'IN', reference_account_type: 'margin' };
//   if (typeName.indexOf('To: C2C account') !== -1) return { action_type: 'OUT', reference_account_type: 'c2c' };
//   if (typeName.indexOf('From: C2C account') !== -1) return { action_type: 'IN', reference_account_type: 'c2c' };
//   if (typeName.indexOf('To: spot account') !== -1) return { action_type: 'OUT', reference_account_type: 'spot' };
//   if (typeName.indexOf('From: spot account') !== -1) return { action_type: 'IN', reference_account_type: 'spot' };
//   return {
//   };
// }

// function _formatWalletLedger(d, o = {}) {
//   return {
//     ...o,
//     unique_id: d.ledger_id,
//     ledger_id: d.ledger_id,
//     coin: d.currency,
//     account_type: 'wallet',
//     fee: _parse(d.fee),
//     time: new Date(d.timestamp),
//     amount: _parse(d.amount),
//     balance: _parse(d.balance),
//     ...parseTypeName(d.typename)
//   };
// }

// function walletLedger(ds, o = {}) {
//   return _.map(ds, _formatWalletLedger);
// }

function _parse(v) {
  return parseFloat(v, 10);
}

function coins(ds) {
  return _.map(ds, (d) => {
    return {
      coin: d.toUpperCase(),
    };
  });
}

function time(t) {
  return { time: new Date(t) };
}

function pair2coin(pair) {
  return pair.split('-')[0].toUpperCase();
}
function pair2symbol(pair) {
  if (!pair) return '';
  return pair.replace('-', '').toLowerCase();
}

// let symbolMap;
// function _updateSymbolMap(ps) {
//   symbolMap = _.keyBy(ps, p => pair2symbol(p.pair));
// }
// _updateSymbolMap(pairsRaw);

// function _formatPair(l) {
//   return {
//     pair: `${l['base-currency'].toUpperCase()}-${l['quote-currency'].toUpperCase()}`,
//     group: l['symbol-partition'],
//     status: l.state,
//     quote_asset_precision: _parse(l['amount-precision']),
//     base_asset_precision: _parse(l['price-precision']),
//     amount_precision: _parse(l['amount-precision']),
//     min_order_amout: _parse(l['min-order-amt']),
//     max_order_amout: _parse(l['max-order-amt']),
//     lever_rate: _parse(l['leverage-ratio'])
//   };
// }

// function pairs(res) {
//   const ps = _.map(res, _formatPair);
//   _updateSymbolMap(ps);
//   return ps;
// }

const baseCoins = ['USDT', 'BTC', 'ETH'];

function formatCoin(coin) {
  if (!coin) return coin;
  coin = coin.toUpperCase();
  if (coin === 'BCHA') coin = 'BCH';
  return coin;
}
function symbol2pair(symbol) {
  symbol = symbol.toUpperCase();
  for (const baseCoin of baseCoins) {
    if (symbol.endsWith(baseCoin)) {
      const quoteCoin = formatCoin(symbol.replace(baseCoin, ''));
      return `${quoteCoin}-${baseCoin}`;
    }
  }
  console.log(`symbol2pair: ${symbol}无法识别`);
}

const orderStatusMap = {
  all: 'ALL',
  filled: 'SUCCESS',
  0: 'NOT_FOUND',
  6: 'SUCCESS',
  part_filled: 'PARTIAL',
  5: 'PARTIAL',
  open: 'UNFINISH',
  canceling: 'CANCELLING',
  10: 'CANCELLING',
  canceled: 'CANCEL',
  cancelled: 'CANCEL',
  7: 'CANCEL',
  submitted: 'UNFINISH',
};

const reverseOrderStatusMap = _.invert(orderStatusMap);

// function formatOrder(d, o = {}) {
//   const { from, to, limit, ...rest } = o;
//   const pps = {};
//   if (d.created_at) pps.server_created_at = new Date(d.created_at);
//   return {
//     // time: t ? new Date(t) : new Date(),
//     instrument_id: d.instrument_id,
//     side: (d.side || o.side || '').toUpperCase(),
//     client_oid: d.client_oid,
//     order_id: d.order_id,
//     notional: d.notional,
//     filled_notional: d.filled_notional,
//     success: o.result,
//     pair: d.product_id || d.instrument_id,
//     amount: _parse(d.size),
//     filled_amount: _parse(d.executed_value || d.filled_size),
//     type: (d.type || o.type || '').toUpperCase(),
//     status: orderStatusMap[d.status] || 'UNFINISH',
//     price: _parse(d.price),
//     ...pps,
//     ...rest
//   };
// }

// function orderO(o) {
//   const { type } = o;
//   let opt = {
//     margin_trading: 1, //
//     type: o.type.toLowerCase(),
//     side: o.side.toLowerCase(),
//     instrument_id: o.instrument_id || o.pair,
//     client_oid: o.client_oid || o.oid
//   };
//   if (type.toUpperCase() === 'LIMIT') {
//     checkKey(o, ['price', 'amount']);
//     opt = {
//       ...opt,
//       instrument_id: o.pair,
//       price: o.price,
//       size: o.amount
//     };
//   } else {
//     // checkKey(o, ['price', 'amount']);
//     console.log('市价单还没做...');
//     process.exit();
//   }
//   return opt;
// }

const periodMap = {
  '1m': '1min',
  '3m': '3min',
  '5m': '5min',
  '15m': '15min',
  '30m': '30min',
  '1d': '1day',
  '1mon': '1mon',
  '1w': '1week',
  '1y': '1year'
};

const base = {
  WS_BASE: 'wss://api.huobi.pro/ws'
};


// /
// 系统当前状态
const systemStatusMap = {
  scheduled: 'WILL',
  'in progress': 'ING',
  verifying: 'ING',
  completed: 'DONE'
};

function getError(res) {
  if (!res) return { error: '数据为空' };
  const error = res['err-msg'] || res['err-code'] || res.error;
  return error || null;
}
module.exports = {
  formatCoin,
  baseCoins,
  systemStatusMap,
  base,
  periodMap,
  pair2coin,
  pair2symbol,
  symbol2pair,
  reverseOrderStatusMap,
  // accountTypeMap,
  // ledgerMap,
  time,
  coins,
  coinsO: direct,
  accountsO: direct,
  orderStatusMap,
  getError,
  // // 资金流动
  // moveBalanceO,
  // moveBalance,
  // withdrawHistoryO,
  // withdrawHistory,
  // walletLedgerO,
  // walletLedger,
  // orderO,
  // formatLedger: _formatLedger,
  // formatWalletLedger: _formatWalletLedger
};
