
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

function symbol2pair(symbol) {
  return symbol.replace('_', '-');
}


function swapTicksO(o = {}) {
  return o;
}
function swapTicks(ds) {
  console.log(ds);
}

module.exports = {
  swapTicksO,
  swapTicks
};
