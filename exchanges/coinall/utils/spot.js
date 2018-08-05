const _ = require('lodash');
const Utils = require('./../../../utils');
const publicUtils = require('./public');

function _parse(v) {
  return parseFloat(v, 10);
}

function formatCoin(ds) {
  return _.map(ds, (d) => {
    return {
      name: d.id,
      deposit: !!d.deposit,
      withdraw: !!d.withdraw
    };
  });
}

function formatTick(ds) {
  return _.map(ds, (d) => {
    return {
      pair: d.product_id,
      exchange: 'coinall',
      ask_price: _parse(d.best_ask),
      bid_price: _parse(d.best_bid),
      last_price: _parse(d.last),
      volume_24: _parse(d.volume),
      time: new Date(d.timestamp)
    };
  });
}

function formatBalance(ds) {
  return formatWallet(ds);
}

function formatWallet(ds) {
  return _.map(ds, (d) => {
    return {
      total_balance: _parse(d.balance),
      locked_balance: _parse(d.holds),
      balance: _parse(d.available),
      coin: d.currency
    };
  });
}


// order
const orderTypeMap = {
  LIMIT: 'limit',
  MARKET: 'market'
};

const tradeTypeMap = {
  lever: 2,
  normal: 1
};

const sideMap = {
  buy: 'buy',
  sell: 'sell'
};

function formatOrderO(o = {}) {
  return {
    price: o.price,
    product_id: o.pair,
    side: sideMap[o.side.toLowerCase()],
    size: o.amount,
    type: orderTypeMap[o.type],
    system_type: tradeTypeMap[o.tradeType] || 1, // 默认为币币交易
  };
}

function formatOrder(o, status) {
  publicUtils.errorDetect(o);
  if (o.order_id) {
    return {
      order_id: `${o.order_id}`,
      order_main_id: o.client_oid,
      status,
      time: new Date()
    };
  }
  throw new Error('order not success...');
}


const moveBalanceMap = {
  // future: 1,
  spot: 1,
  child: 0,
  wallet: 6
};

function formatMoveBalanceO(o = {}) {
  return {
    currency: o.coin,
    amount: o.amount,
    from: moveBalanceMap[o.source],
    to: moveBalanceMap[o.target]
  };
}

module.exports = {
  formatCoin,
  formatTick,
  formatBalance,
  formatWallet,
  // order
  formatOrderO,
  formatOrder,
  formatMoveBalanceO
};
