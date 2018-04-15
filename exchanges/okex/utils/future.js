const _ = require('lodash');
const Utils = require('./../../../utils');
const md5 = require('md5');
const moment = require('moment');

const {
  deFormatPair,
  formatWsResult,
  createWsChanel,
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

// futureOrderHistory
function formatFutureOrderHistoryO(o) {
  const { date } = o;
}

function formatFutureOrderHistory() {
}

// future balances
function formatFutureBalances(ds) {
}

module.exports = {
  formatFutureOrderHistoryO,
  formatFutureOrderHistory,
  formatFutureBalances,
  // ws
  createWsChanelFutureKline,
  createWsChanelFutureTick,
  //
  formatWsFutureKline,
  formatWsFutureTick,
  formatFutureKlineO,
  formatFutureKline,
};
