
const _ = require('lodash');
// const md5 = require('md5');
//
const Utils = require('./../../../utils');

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

module.exports = {
  formatTick,
  swapTicksO,
  swapTicks,
  inst2pair
};
