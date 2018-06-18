const _ = require('lodash');
const Utils = require('./../../../utils');
const publicUtils = require('./public');
// const md5 = require('md5');

const {
  symbol2pair,
  parseOrderType,
  createWsChanel,
  code2OrderStatus,
  orderStatus2Code,
  pair2symbol,
  _parse,
  formatInterval,
  extactPairFromSpotChannel,
} = require('./public');

function formatTick(d, pair) {
  if (!d) {
    console.log('okex tick数据为空...');
    return null;
  }
  const { date, ticker } = d;
  const time = new Date(date * 1000);
  return {
    pair,
    time,
    exchange: 'okex',
    last_price: _parse(ticker.last),
    ask_price: _parse(ticker.buy),
    bid_price: _parse(ticker.sell),
    volume_24: _parse(ticker.vol)
  };
}

// kline
function formatKlineO(o) {
  o = _.cloneDeep(o);
  o.type = formatInterval(o.interval);
  delete o.interval;
  return o;
}
function formatKline(ds, o) {
  return _.map(ds, (d) => {
    const time = new Date(d[0]);
    return Utils.unique.kline({
      ...o,
      exchange: 'okex',
      time,
      open: _parse(d[1]),
      high: _parse(d[2]),
      low: _parse(d[3]),
      close: _parse(d[4]),
    });
  });
}

// depth
function _formatDepth(ds) {
  return _.map(ds, (d) => {
    return {
      exchange: 'okex',
      priceStr: d[0],
      price: _parse(d[0]),
      volumeStr: _parse(d[1]),
      volume: _parse(d[1])
    };
  });
}

function formatDepth(ds) {
  return {
    exchange: 'okex',
    time: new Date(),
    bids: _formatDepth(ds.bids),
    asks: _formatDepth(_.reverse(ds.asks)),
  };
}

function formatOrderBook(ds) {
  return _.map(ds, (d) => {
    return {
      time: new Date(d.date_ms),
      price: d.price,
      volume: d.amount,
      side: d.type.toUpperCase(),
      order_id: d.tid,
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
  return _.values(result); // 随意filter会引起一些问题
  // .filter((d) => {
  //   return d.balance !== 0 || d.locked_balance !== 0 || d.borrow_balance !== 0;
  // });
}

function formatOrderO(o) {
  const { type = 'LIMIT', side, price, pair, amount } = o;
  let okexType = side.toLowerCase();
  if (type && type.toLowerCase() === 'market') okexType += '_market';
  const extra = (price && type !== 'MARKET') ? { price } : {};
  return {
    symbol: pair2symbol(pair),
    type: okexType,
    amount,
    ...extra
  };
}

// cancelOrder
function formatCancelOrderO(o = {}) {
  let { order_id } = o;
  if (Array.isArray(order_id)) order_id = order_id.join(',');
  const symbol = pair2symbol(o.pair);
  return { order_id, symbol };
}
function formatCancelOrder(ds) {
  const { success, error, result, order_id } = ds;
  if (result) {
    return {
      success: order_id.split(','),
      error: []
    };
  } else if (result === false) {
    return {
      success: [],
      error: order_id.split(',')
    };
  } else if (success === true) {
    return {
      success,
      error: null
    };
  } else if (success || error) {
    console.log(success, error);
    return {
      success: success.split(','),
      error: error.split(',')
    };
  }
}

function formatOrderResult(ds, o = {}) {
  if (ds && ds.order_id) return { order_id: ds.order_id, time: new Date(), ...o };
  throw ds;
}
//

function formatOrderInfo(ds, o) {
  if (!ds) return null;
  const { orders } = ds;
  if (!orders) return null;
  let res = _.map(orders, (d) => {
    const { type: tp } = d;
    let [side, type] = tp.split('_').map(d => d.toUpperCase());
    type = type || 'LIMIT';
    return {
      exchange: 'okex',
      order_id: `${d.orders_id}`,
      order_main_id: `${d.order_id}`,
      amount: d.deal_amount,
      price: d.avg_price,
      status: code2OrderStatus[d.status],
      side,
      type,
      time: new Date(d.create_date),
      pair: o.pair
    };
  });
  if (Array.isArray(res) && res.length === 1) res = res[0];
  return res;
}

function formatAllOrdersO(o) {
  o = _.cloneDeep(o);
  o.status = orderStatus2Code[o.status];
  return o;
}
function formatAllOrders(ds) {
  if (!ds) return null;
  return _.map(ds.orders, (d) => {
    return {
      exchange: 'okex',
      amount: d.amount,
      price: d.price || null,
      time: new Date(d.create_date),
      deal_amount: d.deal_amount,
      order_main_id: d.order_id,
      order_id: d.orders_id,
      status: code2OrderStatus[d.status],
      pair: symbol2pair(d.symbol),
      ...parseOrderType(d.type)
    };
  });
}

const createSpotChanelBalance = createWsChanel((pair) => {
  const symbol = pair2symbol(pair, false);
  return `ok_sub_spot_${symbol}_balance`;
});

const createSpotChanelTick = createWsChanel((pair) => {
  const symbol = pair2symbol(pair, false);
  return `ok_sub_spot_${symbol}_ticker`;
});

function formatWsBalance(ds) {
  if (!ds) return null;
  const funds = _.get(ds, '0.data.info.funds');
  const { freezed, free, borrow } = funds;
  const res = {};
  _.forEach(free, (balance, k) => {
    const borrow_balance = _parse(borrow[k]);
    const locked_balance = _parse(freezed[k]);
    balance = _parse(balance);
    const coin = k.toUpperCase();
    res[coin] = { coin, borrow_balance, locked_balance, balance };
  });
  return res;
}

function formatWsTick(ds) {
  ds = _.map(ds, (d) => {
    const { data, channel, result } = d;
    if (result) return null;
    const bid_price = parseFloat(data.buy, 10);
    const ask_price = parseFloat(data.sell, 10);
    const volume_24 = parseFloat(data.vol, 10);
    const change = parseFloat(data.change, 10);
    const last_price = parseFloat(data.last, 10);
    if (!bid_price || !ask_price) return null;
    return {
      pair: extactPairFromSpotChannel(channel, '_ticker'),
      exchange: 'okex',
      bid_price,
      ask_price,
      last_price,
      volume_24,
      change,
      time: new Date()
    };
  }).filter(d => d);
  return _.keyBy(ds, 'pair');
}

function _parseWsDepthChannel(channel) {  // usd_btc_kline_quarter_1min
  const ds = channel.replace('ok_sub_spot_', '').split('_depth');
  const pair = symbol2pair(ds[0], false);
  return { pair };
}

const createSpotChanelDepth = createWsChanel((pair, o) => {
  const symbol = pair2symbol(pair, false);
  return `ok_sub_spot_${symbol}_depth_${o.size}`;
});

function formatWsDepth(ds) {
  const res = {};
  _.forEach(ds, (d) => {
    const { channel, data } = d;
    const { bids, asks, timestamp, result } = data;
    if (result) return null;
    const info = _parseWsDepthChannel(channel);
    const line = {
      ...info,
      exchange: 'okex',
      time: new Date(timestamp),
      bids: _formatDepth(bids),
      asks: _formatDepth(_.reverse(asks)),
    };
    res[info.symbol] = line;
  });
  return res;
}

// function formatOrderInfo(ds) {
//   ds = _.map(ds, (d) => {
//     console.log(ds);
//   });
//   return ds;
// }

function formatPairs(ds) {
  return _.map(ds, (d) => {
    return {
      ...d,
      pair: publicUtils.symbol2pair(d.symbol)
    };
  });
}


module.exports = {
  pair2symbol,
  formatPairs,
  formatTick,
  formatDepth,
  formatOrderBook,
  formatBalances,
  formatOrderO,
  formatCancelOrderO,
  formatCancelOrder,
  formatOrderResult,
  formatKline,
  formatKlineO,
  formatOrderInfo,
  formatAllOrdersO,
  formatAllOrders,
  // ws
  createSpotChanelBalance,
  createSpotChanelDepth,
  createSpotChanelTick,
  formatWsBalance,
  formatWsDepth,
  formatWsTick,
};
