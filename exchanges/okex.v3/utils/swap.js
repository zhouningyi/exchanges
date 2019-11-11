
const _ = require('lodash');
// const md5 = require('md5');
//
const Utils = require('./../../../utils');
const { intervalMap } = require('./public');

const { checkKey } = Utils;


function direct(d) {
  return d;
}

function _parse(v) {
  return parseFloat(v, 10);
}

function inst2pair(symbol) {
  return symbol.replace('-SWAP', '').replace('_', '-');
}


function swapTicksO(o = {}) {
  return o;
}
function formatTick(d) {
  const { instrument_id } = d;
  const pair = inst2pair(instrument_id);
  return {
    instrument_id,
    last_price: _parse(d.last),
    time: new Date(d.timestamp),
    pair,
  };
}
function swapTicks(ds) {
  return _.map(ds, formatTick);
}

function swapFundingRateHistoryO(o) {
  const { pair, ...rest } = o;
  return {
    instrument_id: `${pair}-SWAP`,
    ...rest
  };
}
function swapFundingRateHistory(ds, o) {
  const { pair } = o;
  return _.map(ds, (d) => {
    const time = new Date(d.funding_time);
    const tstr = Math.floor(time.getTime() / 1000);
    return {
      unique_id: `${pair}_${tstr}`,
      pair,
      funding_rate: _parse(d.funding_rate),
      realized_rate: _parse(d.realized_rate),
      interest_rate: _parse(d.interest_rate),
      time
    };
  });
}


//
function swapKlineO(o) {
  const { pair, interval = '15m' } = o;
  const granularity = intervalMap[interval];
  const res = { instrument_id: `${pair}-SWAP`, granularity };
  if (o.timeStart) res.start = o.timeStart;
  if (o.timeEnd) res.end = o.timeEnd;
  return res;
}
function _formatSwapKline(l, o) {
  const { pair, interval } = o;
  const time = new Date(l[0]);
  const tstr = time.getTime();
  const unique_id = `${pair}_${interval}_${tstr}`;
  return {
    unique_id,
    interval,
    pair,
    time,
    open: _parse(l[1]),
    high: _parse(l[2]),
    low: _parse(l[3]),
    close: _parse(l[4]),
    volume_coin: _parse(l[5]),
    volume_amount: _parse(l[6]),
  };
}
function swapKline(res, o) {
  return _.map(res, l => _formatSwapKline(l, o));
}


module.exports = {
  formatSwapKline: _formatSwapKline,
  swapKline,
  swapKlineO,
  swapFundingRateHistoryO,
  swapFundingRateHistory,
  formatTick,
  swapTicksO,
  swapTicks,
  inst2pair
};
