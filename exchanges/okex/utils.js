const _ = require('lodash');
const Utils = require('./../../utils');

const { floor } = Math;

function formatPair(pair) {
  return pair.replace('-', '_').toLowerCase();
}

function formatTick(d) {
  const { date, ticker } = d;
  const time = new Date(date * 1000);
  return {
    time,
    last_price: _parse(ticker.last),
    ask_price: _parse(ticker.buy),
    bid_price: _parse(ticker.sell),
    volume_24: _parse(ticker.vol)
  };
}
function _parse(v) {
  return parseFloat(v, 10);
}
function _formatDepth(ds) {
  return _.map(ds, (d) => {
    return {
      priceStr: d[0],
      price: _parse(d[0]),
      volumeStr: _parse(d[1]),
      volume: _parse(d[1])
    };
  });
}

function formatDepth(ds) {
  return {
    time: new Date(ds.lastUpdateId * 1000),
    bids: _formatDepth(ds.biz),
    asks: _formatDepth(ds.asks),
  };
}

function formatOrderBook(ds) {
  return _.map(ds, (d) => {
    return {
      time: new Date(d.date_ms),
      price: d.price,
      volume: d.amount,
      side: d.type.toUpperCase(),
      orderId: d.tid,
    };
  });
}

function formatBalances(ds) {
  const funds = _.get(ds, 'info.funds');
  if (!funds) return null;
  const { free, freezed, borrow } = funds;
  const result = {};
  _.forEach(free, (str, coin) => {
    _.set(result, `${coin}.balance_str`, str);
    _.set(result, `${coin}.balance`, _parse(str));
  });
  _.forEach(borrow, (str, coin) => {
    _.set(result, `${coin}.borrow_balance_str`, str);
    _.set(result, `${coin}.borrow_balance`, _parse(str));
  });
  _.forEach(freezed, (str, coin) => {
    _.set(result, `${coin}.locked_balance_str`, str);
    _.set(result, `${coin}.locked_balance`, _parse(str));
    //
    _.set(result, `${coin}.coin`, coin.toUpperCase());
  });
  return _.values(result).filter((d) => {
    return d.balance !== 0 || d.lockedBalance !== 0 || d.borrowBalance !== 0;
  });
}

function formatOrderO(o) {
  const { type = 'LIMIT', side, price, pair, amount } = o;
  let okexType = side.toLowerCase();
  if (type && type.toLowerCase() === 'market') okexType += '_market';
  const extra = price ? { price } : {};
  return {
    symbol: formatPair(pair),
    type: okexType,
    amount,
    ...extra
  };
}

function formatCancelOrderO(o = {}) {
  let { orderId } = o;
  if (Array.isArray(orderId)) orderId = orderId.join(',');
  const symbol = formatPair(o.pair);
  return { order_id: orderId, symbol };
}

function formatOrderResult(ds) {
  if (ds.order_id) {
    return {
      orderId: ds.order_id
    };
  }
  throw ds;
  // return null;
}

function formatKline() {
}

// function _formatDepth(ds) {
//   return _.map(ds, (d) => {
//     return {
//       price: d[0],
//       volume: d[1]
//     };
//   });
// }
// function formatDepth(d) {
//   const { bids, asks } = d;
//   return {
//     bids: _formatDepth(bids),
//     asks: _formatDepth(asks),
//   };
// }

function createWsChanelTick(pairs) {
  const ds = _.map(pairs, ({ pair }) => {
    pair = pair.replace(/-/g, '_').toLowerCase();
    return { event: 'addChannel', channel: `ok_sub_spot_${pair}_ticker` };
  });
  return JSON.stringify(ds);
}
function createWsChanelBalance(pairs) {
  const ds = _.map(pairs, ({ pair }) => {
    pair = pair.replace(/-/g, '_').toLowerCase();
    return { event: 'addChannel', channel: `ok_sub_spot_${pair}_balance` };
  });
  return JSON.stringify(ds);
}

function _extactChannel(str) {
  return str.replace('ok_sub_spot_', '').replace('_ticker', '');
}
function parsePairName(channel) {
  return _extactChannel(channel).replace('_', '-').toUpperCase();
}

function formatWsBalance(ds) {
  return _.map(ds, (d) => {
    const { data, channel } = d;
    const pair = parsePairName(channel);
    if (!data) return;
    const { info } = data;
    if (!info) return;
    const { free: balance, freezed: balanceLocked } = info;
    return {
      pair, balance, balanceLocked
    };
  }).filter(d => d);
}

function formatWsTick(ds) {
  return _.map(ds, (d) => {
    const { data, channel } = d;
    const bid_price = parseFloat(data.buy, 10);
    const ask_price = parseFloat(data.sell, 10);
    const volume24 = parseFloat(data.vol, 10);
    const change = parseFloat(data.change, 10);
    const last_price = parseFloat(data.last, 10);
    if (!bid_price || !ask_price) return null;
    return {
      pair: parsePairName(channel),
      bid_price,
      ask_price,
      last_price,
      volume24,
      change,
      time: new Date()
    };
  }).filter(d => d);
}
module.exports = {
  formatPair,
  formatTick,
  formatDepth,
  formatOrderBook,
  formatBalances,
  formatOrderO,
  formatCancelOrderO,
  formatOrderResult,
  formatKline,
  // ws
  createWsChanelBalance,
  createWsChanelTick,
  formatWsBalance,
  formatWsTick,
};
