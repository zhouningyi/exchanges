
const _ = require('lodash');
const PAIRS = require('./meta/pairs.json');
const Utils = require('./../../utils');

function pair2symbol(pair) {
  return pair.replace('-', '').toLowerCase();
}
function symbol2pair(symbol) {
  const info = PAIRS[symbol];
  return info.pair;
}
function formatPair(o = {}) {
  o = _.cloneDeep(o);
  const { pair } = o;
  if (!pair) return o;
  delete o.pair;
  const symbol = pair2symbol(pair);
  return { ...o, symbol };
}

function getPairObject(ds) {
  ds = _.cloneDeep(ds);
  ds = _.map(ds, (d) => {
    d.symbol = pair2symbol(d.pair);
    return d;
  });
  return _.keyBy(ds, 'symbol');
}

function formatPairs(ds) {
  return _.map(ds, (d) => {
    return {
      pair: `${d.base_currency}-${d.quote_currency}`.toUpperCase(),
      price_decimal: d.price_decimal,
      amount_decimal: d.amount_decimal
    };
  });
}
function formatTick(d, o) {
  if (d.ticker) d = d.ticker;
  return Utils.unique.tick({
    pair: o.pair,
    last_price: d[0],
    last_volume: d[1],
    ask_price: d[2],
    ask_volume: d[3],
    bid_price: d[4],
    bid_volume: d[5],
    volume_24: d[9],
    time: new Date(),
  });
}
// price_decimal

function _parse(v) {
  return parseFloat(v, 10);
}

function formatBalance(ds) {
  ds = _.map(ds, (d) => {
    return {
      coin: d.currency.toUpperCase(),
      balance: _parse(d.balance),
      locked_balance: _parse(d.frozen),
    };
  });
  ds = _.sortBy(ds, d => -d.balance);
  return ds;
}

function formatOrderO(o) {
  o.side = o.side.toLowerCase();
  o.type = o.type.toLowerCase();
  return o;
}

function formatOrder(order_id, o) {
  return {
    order_id,
    ...o
  };
}


const statusMap = {
  submitted: 'UNFINISH',
  partial_filled:	'UNFINISH',
  partial_canceled:	'CANCEL',
  filled: 'FINISH',
  canceled:	'CANCEL',
  // pending_cancel: 'CANCELLING',
};
const statusMapRev = {
  ALL: 'submitted,partial_filled,partial_canceled,filled,canceled'
};
_.forEach(statusMap, (v, k) => {
  let line = statusMapRev[v] || '';
  if (line) {
    line += `,${k}`;
  } else {
    line = k;
  }
  statusMapRev[v] = line;
});

function formartOrdersO(o) {
  o = _.cloneDeep(o);
  const status = o.status || 'ALL';
  const states = statusMapRev[status];
  delete o.status;
  return {
    ...o,
    states
  };
}
function formartOrders(ds) {
  return _.map(ds, (d) => {
    return {
      order_id: d.id,
      pair: pair2symbol(d.symbol),
      status: statusMap[d.state],
      filled_amount: _parse(d.filled_amount),
      amount: _parse(d.amount),
      time: new Date(d.created_at),
      type: d.type.toUpperCase(),
    };
  });
}

function formatCancelOrderO(o) {
  return {
    ...o
  };
}

module.exports = {
  formatPair,
  pair2symbol,
  symbol2pair,
  formatPairs,
  getPairObject,
  formatTick,
  formatBalance,
  formatOrderO,
  formartOrdersO,
  formartOrders,
  formatCancelOrderO,
  formatOrder
};
