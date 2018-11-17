
const _ = require('lodash');
const md5 = require('md5');
//
const Utils = require('./../../../utils');
const publicUtils = require('./public');


function direct(d) {
  return d;
}

function _parse(v) {
  return parseFloat(v, 10);
}


function wallet(ds, o) {
  let res = _.map(ds, (d) => {
    return {
      total_balance: _parse(d.balance),
      locked_balance: _parse(d.hold),
      balance: _parse(d.available),
      coin: d.currency
    };
  });
  if (o.notNull) {
    res = _.filter(res, d => d.balance);
  }
  return res;
}


function balancesO(o = {}) {
  return o;
}

function balances(ds, o = {}) {
  const res = wallet(ds, o);
  return res;
}


module.exports = {
  wallet,
  // order
  balancesO,
  balances,
};
