const _ = require('lodash');
const Utils = require('./../../../utils');
const md5 = require('md5');
const moment = require('moment');

const {
  deFormatPair,
  formatWsResult,
  createWsChanel,
  code2OrderStatus,
  orderStatus2Code,
  formatPair,
  _parse,
  formatInterval,
} = require('./public');

// future kline

function formatFutureKlineO(o = {}) {
  o = _.cloneDeep(o);
  o.type = formatInterval(o.interval);
  delete o.interval;
  return o;
}

function formatFutureKline(ds, o) {
  return _.map(ds, (d) => {
    const time = new Date(d[0]);
    const tstr = time.getTime();
    return {
      ...o,
      unique_id: md5(`${o.pair}_${tstr}_${o.interval}_${o.contract_type}`),
      time,
      open: _parse(d[1]),
      high: _parse(d[2]),
      low: _parse(d[3]),
      close: _parse(d[4]),
      volume_amount: _parse(d[5]),
      volume_coin: _parse(d[6])
    };
  });
}

//
function parseFutureTickChanel(channel) {
  const ds = channel.replace('ok_sub_future', '').split('_ticker_');
  return {
    pair: ds[0].split('_').reverse().join('-').toUpperCase(),
    contract_type: ds[1]
  };
}

function formatWsFutureTick(ds) {
  ds = _.map(ds, (d) => {
    const { channel } = d;
    d = d.data;
    if (d.result) return null;
    const pps = parseFutureTickChanel(channel);
    const bid_price = _parse(d.buy);
    const ask_price = _parse(d.sell);
    const time = new Date();
    const tstr = time.getTime();
    return {
      unique_id: md5(`${pps.pair}_${pps.contract_type}_${bid_price}_${tstr}`),
      ...pps,
      time,
      high: _parse(d.high),
      low: _parse(d.low),
      volume_24: _parse(d.vol),
      bid_price,
      ask_price,
      last_price: _parse(d.last),
      unit_amount: _parse(d.unitAmount),
      hold_amount: _parse(d.hold_amount),
      contract_id: d.contractId,
    };
  }).filter(d => d);
  return _.keyBy(ds, 'pair');
}

//
const createWsChanelFutureTick = createWsChanel((pair, o) => {
  pair = formatPair(pair, true);
  return `ok_sub_future${pair}_ticker_${o.interval}`;
});

const createWsChanelFutureKline = createWsChanel((pair, o) => {
  pair = formatPair(pair, true);
  const interval = formatInterval(o.interval);
  return `ok_sub_future${pair}_kline_${o.contract_type}_${interval}`;
});

function _parseWsFutureChannel(channel) {  // usd_btc_kline_quarter_1min
  const symbol = channel.replace('ok_sub_future', '').split('_kline_')[0];
  return deFormatPair(symbol, true);
}

const formatWsFutureKline = formatWsResult((kline, o) => {
  const res = _.map(kline, (d) => {
    const time = new Date(_parse(d[0]));
    const tstr = time.getTime();
    return {
      ...o,
      unique_id: md5(`${o.pair}_${tstr}_${o.interval}_${o.contract_type}`),
      time,
      open: _parse(d[1]),
      high: _parse(d[2]),
      low: _parse(d[3]),
      close: _parse(d[4]),
      volume_amount: _parse(d[5]),
      volume_coin: _parse(d[6]),
    };
  });
  return _.keyBy(res, 'unique_id');
});

// move Balance
const moveType2code = {
  future: {
    spot: 2
  },
  spot: {
    future: 1
  }
};
function formatMoveBalanceO(o) {
  const { source, target, amount, coin } = o;
  const type = _.get(moveType2code, `${source}.${target}`);
  const symbol = `${coin.toLowerCase()}_usd`;
  return { type, amount, symbol };
}


// futureOrderHistory
function formatFutureOrderHistoryO(o) {
  const { date } = o;
}

function formatFutureOrderHistory() {
}

// future balances
function formatFutureBalances(ds) {
}

//
const typeMap = {
  buy: {
    up: 1, // 开多
    down: 2, // 开空
  },
  sell: {
    up: 3, // 平多
    down: 4, // 平空
  }
};
const reverseTypeMap = {
  1: {
    side: 'BUY',
    direction: 'UP'
  },
  2: {
    side: 'BUY',
    direction: 'DOWN'
  },
  3: {
    side: 'SELL',
    direction: 'UP'
  },
  4: {
    side: 'SELL',
    direction: 'DOWN'
  }
};
function formatFutureOrderO(o) {
  let { pair, contract_type, lever_rate, amount, side, direction, type, price } = o;
  side = side.toLowerCase();
  type = type.toLowerCase();
  if (type === 'limit') {
    if (!o.price) {
      console.log('type=limit 必须有price');
      process.exit();
    }
  }
  pair = pair.toLowerCase().replace('usdt', 'usd');
  const opt = {
    pair,
    type: _.get(typeMap, `${side}.${direction}`),
    contract_type,
    lever_rate,
    amount,
    ...(type === 'limit' ? {
      price,
      match_price: 0
    } : {
      match_price: 1
    })
  };
  return opt;
}

function formatFutureOrderInfo(ds, o) {
  if (!ds) return null;
  const { orders } = ds;
  if (!orders) return null;
  let res = _.map(orders, (d) => {
    return {
      order_id: `${d.order_id}`,
      contract_name: d.contract_name,
      amount: d.deal_amount,
      price: d.price || d.price_avg,
      status: code2OrderStatus[d.status],
      lever_rate: d.lever_rate,
      fee: d.fee,
      time: new Date(d.create_date),
      pair: o.pair,
      ...(reverseTypeMap[d.type])
    };
  });
  if (Array.isArray(res) && res.length === 1) res = res[0];
  return res;
}


module.exports = {
  formatFutureOrderHistoryO,
  formatFutureOrderHistory,
  formatFutureBalances,
  formatMoveBalanceO,
  formatFutureOrderO,
  formatFutureOrderInfo,
  // ws
  createWsChanelFutureKline,
  createWsChanelFutureTick,
  //
  formatWsFutureKline,
  formatWsFutureTick,
  formatFutureKlineO,
  formatFutureKline,
};
