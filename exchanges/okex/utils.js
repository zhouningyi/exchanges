const _ = require('lodash');
const Utils = require('./../../utils');

const { floor } = Math;

function formatPair(pair) {
  return pair.replace('-', '_').toLowerCase();
}

function formatTick(d) {
  const { date, ticker } = d;
  const time = new Date(date * 1000);
  return Utils.replace({
    time,
    ...ticker
  }, {
    vol: 'vol24'
  });
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
    _.set(result, `${coin}.balanceStr`, str);
    _.set(result, `${coin}.balance`, _parse(str));
  });
  _.forEach(borrow, (str, coin) => {
    _.set(result, `${coin}.borrowBalanceStr`, str);
    _.set(result, `${coin}.borrowBalance`, _parse(str));
  });
  _.forEach(freezed, (str, coin) => {
    _.set(result, `${coin}.lockedBalanceStr`, str);
    _.set(result, `${coin}.lockedBalance`, _parse(str));
    //
    _.set(result, `${coin}.coin`, coin);
  });
  return _.values(result).filter((d) => {
    return d.balance !== 0 || d.lockedBalance !== 0 || d.borrowBalance !== 0;
  });
}


function formatOrder(o) {
  const { type, side, price, pair, amount } = o;
  let okexType = side.toLowerCase();
  if (type.toLowerCase() === 'market') okexType += '_market';
  const extra = price ? { price } : {};
  return {
    symbol: formatPair(pair),
    type: okexType,
    amount,
    ...extra
  };
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
module.exports = {
  formatPair,
  formatTick,
  formatDepth,
  formatOrderBook,
  formatBalances,
  formatOrder,
  formatOrderResult,
  formatKline
};
