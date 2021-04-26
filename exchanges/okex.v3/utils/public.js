const _ = require('lodash');
const md5 = require('md5');

const Utils = require('./../../../utils');
const ef = require('./../../../utils/formatter');
const config = require('./../config');

const { checkKey } = Utils;
// const subscribe = Utils.ws.genSubscribe(config.WS_BASE);

function pair2symbol(pair, isReverse = false) {
  if (!isReverse) return pair.replace('-', '_').toLowerCase();
  return pair.split('-').reverse().join('_').toLowerCase();
}

function symbol2pair(symbol, isFuture = false) {
  let ss = symbol.split('_');
  if (isFuture) ss = ss.reverse();
  return ss.join('-').toUpperCase();
}

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
// [60/180/300 900/1800/3600/7200/14400/21600/43200/86400/604800]
const intervalMap = {
  '1m': 60,
  '3m': 180,
  '5m': 300,
  '15m': 900,
  '30m': 1800,
  '1h': 3600,
  '2h': 7200,
  '4h': 14400,
  '6h': 21600,
  '12h': 43200,
  '1d': 86400,
  '1w': 604800,
};

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

function pair2coin(pair) {
  return pair.split('-')[0].toUpperCase();
}
// function coin2pair(coin) {
//   return (`${coin}-USDT`).toUpperCase();
// }

const accountTypeMap = {
  sub_account: 0,
  spot: 1,
  future: 3,
  c2c: 4,
  margin: 5,
  wallet: 6,
  ETT: 7,
  swap: 9
};

function direct(d) {
  return d;
}

const accountTypeMapInvert = _.invert(accountTypeMap);

// ////////////
function formatDigit(num, n) {
  const k = Math.pow(10, n);
  return Math.floor(num * k) / k;
}
// move Balance
function moveBalanceO(o = {}) {
  const { coin, instrument_id, source_pair, to_instrument_id, target_pair, sub_account } = o;
  const source = o.source.toLowerCase();
  const target = o.target.toLowerCase();
  if (source === 'sub_account') checkKey(o, ['sub_account']);
  if (source === 'margin') checkKey(o, ['source_pair']);
  const amount = formatDigit(o.amount, 4);// 有时候会有精度问题
  const from = accountTypeMap[source];
  if (!from) {
    console.log(`source: ${source}错误，找不到相应的错误码`);
    return false;
  }
  const to = accountTypeMap[target];
  if (!to) {
    console.log(`target: ${target}错误，找不到相应的错误码`);
    return false;
  }
  const currency = coin;// .toLowerCase();
  const opt = { from, to, currency, amount };
  if (sub_account) opt.sub_account = sub_account;
  const _instrument_id = instrument_id || source_pair;
  if (_instrument_id) opt.instrument_id = _instrument_id;
  const _to_instrument_id = to_instrument_id || target_pair;
  if (_to_instrument_id) opt.to_instrument_id = _to_instrument_id;
  return opt;
}
function moveBalance(res, o = {}) {
  const success = res.result === true;
  const error = res.result === true ? null : res.result || res.message;
  return {
    trx_id: res.transfer_id,
    coin: o.coin,
    source: o.source,
    target: o.target,
    amount: res.amount || o.amount,
    success,
    error
  };
}


// 流水
const ledgerMap = {
  1: '充值',
  2: '提现',
  13: '撤销提现',
  18: '转入交割合约',
  19: '交割合约转出',
  20: '转入子账户',
  21: '子账户转出',
  28: '领取',
  29: '转入指数交易区',
  30: '转出指数交易区',
  31: '转入点对点账户',
  32: '点对点账户转出',
  33: '转入币币杠杆账户',
  34: '币币杠杆账户转出',
  37: '转入币币账户',
  38: '币币账户转出',
  41: '点卡手续费',
  42: '购买点卡',
  43: '点卡转让',
  44: '撤销点卡转让',
  47: '系统冲正',
  48: '活动得到',
  49: '活动送出',
  50: '预约得到',
  51: '预约扣除',
  52: '发红包',
  53: '抢红包',
  54: '红包退还',
  55: '转入永续',
  56: '永续转出',
  57: '转入余币宝',
  58: '余币宝转出',
  59: '套保账户转出',
  60: '转入套保账户',
  61: '兑换',
};

const rLedgerMap = _.invert(ledgerMap);

function walletLedgerO(o) {
  const defaultO = { limit: 100 };
  o = { ...defaultO, ...o };
  const opt = {
    limit: o.limit
  };
  if (o.type) opt.type = accountTypeMap[o.type];
  if (o.from) opt.from = rLedgerMap[o.source];
  if (o.to) opt.to = rLedgerMap[o.to];
  return opt;
}

const execTypeMap = {
  T: 'TAKER',
  M: 'MAKER'
};
function _formatLedger(d, o = {}) {
  const amount = d.size || d.amount;
  return {
    ...o,
    unique_id: d.ledger_id,
    ledger_id: d.ledger_id,
    instrument_id: d.instrument_id,
    exec_type: execTypeMap[d.exec_type],
    price: d.price !== undefined ? _parse(d.price) : undefined,
    coin: d.currency,
    type: d.typeName || d.type || d.typename,
    amount: amount !== undefined ? _parse(amount) : undefined,
    fee: d.fee !== undefined ? _parse(d.fee) : undefined,
    balance: d.balance !== undefined ? _parse(d.balance) : undefined,
    pair: _.get(d, 'details.product_id') || d.product_id,
    order_id: _.get(d, 'details.order_id'),
    side: d.side ? d.side.toUpperCase() : undefined,
    // source: accountTypeMapInvert[d.from],
    // target: accountTypeMapInvert[d.to],
    time: new Date(d.timestamp)
  };
}

function parseTypeName(typeName) {
  if (typeName.indexOf('Get from activity') !== -1) return { action_type: 'IN', reference_account_type: 'okex' };
  if (typeName.indexOf('Deposit') !== -1) return { action_type: 'IN', reference_account_type: 'other_account' };
  if (typeName.indexOf('withdrawal') !== -1) return { action_type: 'OUT', reference_account_type: 'other_account' };
  if (typeName.indexOf('To: margin account') !== -1) return { action_type: 'OUT', reference_account_type: 'margin' };
  if (typeName.indexOf('From: margin account') !== -1) return { action_type: 'IN', reference_account_type: 'margin' };
  if (typeName.indexOf('To: C2C account') !== -1) return { action_type: 'OUT', reference_account_type: 'c2c' };
  if (typeName.indexOf('From: C2C account') !== -1) return { action_type: 'IN', reference_account_type: 'c2c' };
  if (typeName.indexOf('To: spot account') !== -1) return { action_type: 'OUT', reference_account_type: 'spot' };
  if (typeName.indexOf('From: spot account') !== -1) return { action_type: 'IN', reference_account_type: 'spot' };
  return {
  };
}

function _formatWalletLedger(d, o = {}) {
  return {
    ...o,
    unique_id: d.ledger_id,
    ledger_id: d.ledger_id,
    coin: d.currency,
    account_type: 'wallet',
    fee: _parse(d.fee),
    time: new Date(d.timestamp),
    amount: _parse(d.amount),
    balance: _parse(d.balance),
    ...parseTypeName(d.typename)
  };
}

function walletLedger(ds, o = {}) {
  return _.map(ds, _formatWalletLedger);
}

function _parse(v) {
  return parseFloat(v, 10);
}

function coins(ds) {
  return _.map(ds, (d) => {
    return {
      coin: d.currency,
      deposit: !!d.can_deposit,
      withdraw: !!d.can_withdraw,
      min_widthdraw: _parse(d.min_withdrawal)
    };
  });
}

function getError(d) {
  if (d.code && d.message) {
    return d.message;
  }
  return false;
}

const orderStatusMap = {
  all: 'ALL',
  filled: 'SUCCESS',
  part_filled: 'PARTIAL',
  open: 'UNFINISH',
  canceling: 'CANCELLING',
  canceled: 'CANCEL',
  cancelled: 'CANCEL',
};

const orderStateMap = {
  '-2': 'FAIL',
  // all: 'ALL',
  2: 'SUCCESS',
  1: 'PARTIAL',
  0: 'UNFINISH',
  3: 'UNFINISH',
  4: 'CANCELLING',
  '-1': 'CANCEL',
};

const reverseOrderStatusMap = _.invert(orderStatusMap);

function formatOrder(d, o = {}, error) {
  if (error) {
    console.log(d, o, error, 'error....');
    process.exit();
  }
  const { from, to, limit, ...rest } = o;
  const pps = {};
  if (d.created_at || d.timestamp) pps.server_created_at = new Date(d.created_at || d.timestamp);
  if (d.last_fill_time) pps.server_updated_at = new Date(d.last_fill_time);
  const res = {
    instrument_id: d.instrument_id,
    side: (d.side || o.side || '').toUpperCase(),
    client_oid: d.client_oid,
    order_id: d.order_id,
    notional: d.notional,
    filled_notional: d.filled_notional,
    success: o.result,
    pair: d.product_id || d.instrument_id,
    amount: _parse(d.size),
    filled_amount: _parse(d.executed_value || d.filled_size),
    type: (d.type || o.type || '').toUpperCase(),
    status: orderStatusMap[d.status] || orderStateMap[d.state] || 'UNFINISH',
    price: _parse(d.price),
    order_type: reverseOrderTypeMap[d.order_type],
    ...pps,
    ...rest
  };
  if (d.price_avg) res.price_avg = _parse(d.price_avg);
  if (d.margin_trading) {
    if (d.margin_trading === 2 || d.margin_trading === '2') {
      res.instrument = 'margin';
    } else {
      res.instrument = 'spot';
    }
  }
  return res;
}

function orderO(o) {
  const { type, order_type } = o;
  const client_oid = o.client_oid || o.oid;
  let res = {
    margin_trading: 1, //
    type: o.type.toLowerCase(),
    side: o.side.toLowerCase(),
    instrument_id: o.instrument_id || o.pair,
    client_oid: o.client_oid || o.oid
  };
  if (client_oid) res.client_oid = client_oid;
  if (order_type) res.order_type = orderTypeMap[order_type.toUpperCase()];
  if (type.toUpperCase() === 'LIMIT') {
    checkKey(o, ['price', 'amount']);
    res = {
      ...res,
      instrument_id: o.pair,
      price: o.price,
      size: o.amount
    };
  } else if (type.toUpperCase() === 'MARKET') {
    res = {
      ...res,
      type: 'market',
      instrument_id: o.pair,
      size: o.amount
    };
    // checkKey(o, ['price', 'amount']);
  } else {
    console.log('public.orderO/下单不明情况...');
    process.exit();
  }
  return res;
}

const base = {
  WS_BASE: 'wss://real.okex.com:10440/websocket/okexapi'
};
const orderTypeMap = {
  NORMAL: 0,
  MAKER: 1,
  FOK: 2,
  IOC: 3
};
const reverseOrderTypeMap = _.invert(orderTypeMap);

const orderFillTypeMap = {
  T: 'TAKER',
  M: 'MAKER'
};

const directionFillMap = {
  long: 'UP',
  short: 'DOWN'
};

function formatFill(d, o) {
  return {
    order_id: d.order_id,
    trade_id: d.trade_id,
    instrument_id: d.instrument_id,
    price: _parse(d.price),
    amount: o.instrument === 'spot' ? _parse(d.size) : _parse(d.order_qty),
    fee: _parse(d.fee),
    time: d.created_at ? new Date(d.created_at) : new Date(d.timestamp),
    exec_type: orderFillTypeMap[d.exec_type],
    direction: d.side ? directionFillMap[d.side.toLowerCase()] : null,
    side: d.side ? d.side.toUpperCase() : null,
    coin: d.currency || d.instrument_id ? d.instrument_id.split('-')[0] : null,
    ...o
  };
}

function formatAssetLedger(d, o) {
  // console.log(d, 'ddd....');
  const coin = d.currency;
  // spot
  // {
  //   timestamp: '2020-02-02T08:17:59.000Z',
  //   ledger_id: '9346130336',
  //   created_at: '2020-02-02T08:17:59.000Z',
  //   currency: 'BSV',
  //   amount: '0.10603634',
  //   balance: '67.94539549',
  //   type: 'trade',
  //   details: {
  //     instrument_id: 'BSV-USDT',
  //     order_id: '4318526116736000',
  //     product_id: 'BSV-USDT'
  //   },
  //   resp_time: 216
  // }

  const res = {
    id: d.ledger_id,
    order_id: d.order_id || _.get(d.details, 'order_id'),
    instrument_id: d.instrument_id || _.get(d.details, 'instrument_id'),
    balance: ef.isSpot(o) ? _parse(d.amount) : _parse(d.balance),
    // balance: ef.isSpot(o) ? _parse(d.balance) : _parse(d.amount),
    time: new Date(d.timestamp),
    type: o.type || d.type,
    coin,
    ...o
  };
  if (!['future'].includes(o.instrument)) res.fee = _parse(d.fee) || null;
  return res;
}

function assetTotalBalanceO(o) {
  return o;
}

function assetTotalBalance(res) {
  console.log(res);
}

const systemStatusMap = {
  0: 'WILL',
  1: 'ING',
  2: 'DONE'
};
function systemStatusO(o) {
  return o;
}
function systemStatus(res) {
  res = _.map(res, (l) => {
    return {
      title: l.title,
      status: systemStatusMap[l.status],
      time_start: new Date(l.start_time),
      time_end: new Date(l.end_time),
    };
  });
  return res;
}

function getPrecision(v) {
  v = _parse(v);
  return Math.log10(1 / v);
}

module.exports = {
  getPrecision,
  assetTotalBalanceO,
  assetTotalBalance,
  orderTypeMap,
  reverseOrderTypeMap,
  pair2coin,
  base,
  symbol2pair,
  pair2symbol,
  formatOrder,
  orderStatusMap,
  reverseOrderStatusMap,
  accountTypeMap,
  ledgerMap,
  coins,
  coinsO: direct,
  getError,
  intervalMap,
  formatFill,
  // 资金流动
  moveBalanceO,
  moveBalance,
  walletLedgerO,
  walletLedger,
  orderO,
  formatLedger: _formatLedger,
  formatWalletLedger: _formatWalletLedger,
  formatAssetLedger,
  systemStatusO,
  systemStatus
};
