
const _ = require('lodash');
// const md5 = require('md5');
//
const Utils = require('./../../../utils');
const ef = require('./../../../utils/formatter');
const { intervalMap, pair2coin, orderTypeMap, getPrecision, reverseOrderTypeMap } = require('./public');
const futureApiUtils = require('./future');
const deepmerge = require('deepmerge');
const publicUtils = require('./public');

const balance_type = 'WALLET';
const exchange = 'OKEX';

const { checkKey, throwError, cleanObjectNull } = Utils;

function direct(d) {
  return d;
}

function _parse(v) {
  return parseFloat(v, 10);
}

function empty() {
  return {};
}

function _formatWalletBalance(d) {
  const res = {
    exchange,
    balance_type,
    coin: d.currency,
    balance: _parse(d.balance),
    locked_balance: _parse(d.hold),
  };
  res.balance_available = d.available ? _parse(d.available || 0) : res.balance - res.locked_balance;
  res.balance_id = ef.getBalanceId(res);
  return res;
}

function walletBalances(ds, o) {
  const res = _.map(ds, _formatWalletBalance);
  return res;
}

// function
// 提币历史

const walletStatusMap = {
  0: 'UNFINISH',
  1: 'WAITING',
  2: 'SUCCESS',
  3: 'DELAY'
};

function _formatWithDrawHistory(d, type = 'WITHDRAW') {
  const { fee, amount, timestamp, from: source, to: target, txid, tag, currency: coin, payment_id } = d;
  const time = new Date(timestamp);
  const status = walletStatusMap[d.status];
  const res = { type, time, amount: _parse(amount), coin, source, target, status };
  if (tag) res.tag = tag;
  if (payment_id) res.payment_id = payment_id;
  if (txid)res.txid = txid;
  if (fee) res.fee = _parse(fee);
  // console.log(d, 'd...');
  res.unique_id = `${type}_${d.deposit_id || d.withdrawal_id}`;
  return res;
}

const withdrawHistory = ds => _.map(ds, d => _formatWithDrawHistory(d, 'WITHDRAW'));

const depositHistory = ds => _.map(ds, d => _formatWithDrawHistory(d, 'DEPOSIT'));

function walletAssets(ds) {
  return _.map(ds, (d) => {
    let deposit = false;
    if (d.can_deposit === '1') deposit = true;
    let withdraw = false;
    if (d.can_withdraw === '1') withdraw = true;
    return {
      coin: d.currency,
      deposit,
      withdraw,
      min_withdraw: _parse(d.min_withdrawal)
    };
  });
}

module.exports = {
  walletAssetsO: empty,
  walletAssets,
  depositHistoryO: empty,
  depositHistory,
  withdrawHistoryO: empty,
  withdrawHistory,
  walletBalancesO: empty,
  walletBalances,
};
