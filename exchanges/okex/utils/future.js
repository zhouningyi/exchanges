const _ = require('lodash');
const Utils = require('./../../../utils');
const md5 = require('md5');

const {
  deFormatPair,
  formatWsResult,
  createWsChanel,
  formatPair,
  _parse,
  formatInterval,
  extactPairFromFutureChannel,
} = require('./public');


function parseFutureTickChanel(channel) {
  const ds = channel.replace('ok_sub_future', '').split('_ticker_');
  return {
    pair: ds[0].split('_').reverse().join('-').toUpperCase(),
    contact_type: ds[1]
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
    const tstr = time.getTime() % (24 * 3600 * 1000);
    return {
      unique_id: md5(`${pps.pair}_${pps.contact_type}_${bid_price}_${tstr}`),
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
  return `ok_sub_future${pair}_ticker_${o.contact_type}`;
});

const createWsChanelFutureKline = createWsChanel((pair, o) => {
  pair = formatPair(pair, true);
  const interval = formatInterval(o.interval);
  return `ok_sub_future${pair}_kline_${o.contact_type}_${interval}`;
});

function _parseWsFutureChannel(channel) {  // usd_btc_kline_quarter_1min
  const symbol = channel.replace('ok_sub_future', '').split('_kline_')[0];
  return deFormatPair(symbol);
}

const formatWsFutureKline = formatWsResult((kline, chanel) => {
  const res = _.map(kline, (d) => {
    const pair = _parseWsFutureChannel(chanel);
    const time = new Date(_parse(d[0]));
    const tstr = Math.floor(time.getTime() / 1000);
    return {
      unique_id: `${pair}_${tstr}`,
      pair,
      time,
      open: _parse(d[1]),
      high: _parse(d[2]),
      low: _parse(d[3]),
      close: _parse(d[4]),
      volume_amount: _parse(d[5]),
      volume_coin: _parse(d[6]),
    };
  });
  return res;
});

//
module.exports = {
  // ws
  createWsChanelFutureKline,
  createWsChanelFutureTick,
  //
  formatWsFutureKline,
  formatWsFutureTick,
};
