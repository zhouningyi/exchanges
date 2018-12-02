const _ = require('lodash');
const Utils = require('./../../../utils');
const META = require('./../meta');

const meta = META;
const { pairMap, pairInfo } = meta;
const { floor } = Math;

// function _formatPair

function formatPairString(pair) {
  return pair.split('-').join('');
}
function formatPair(params) {
  params = Utils.replace(params, { pair: 'symbol' });
  if (params.symbol) params.symbol = params.symbol.replace('-', '');
  return params;
}

function formatKline(ds, o = {}) {
  const { pair, interval } = o;
  if (!ds) return null;
  return _.map(ds, (d) => {
    return Utils.unique.kline({
      interval,
      pair,
      time: new Date(d[0]),
      open: parseFloat(d[1], 10),
      high: parseFloat(d[2], 10),
      low: parseFloat(d[3], 10),
      close: parseFloat(d[4], 10),
      amount: parseFloat(d[5], 10),
      quote_volume: parseFloat(d[7], 10),
      count: parseInt(d[8], 10),
      taker_buy_base_volume: parseInt(d[9], 10),
      taker_buy_quote_volume: parseInt(d[10], 10),
    });
  });
}

//
function _parse(v) {
  return parseFloat(v, 10);
}
function _hasValue(d, key) {
  return _parse(d[key]) !== 0;
}

function formatBalances(ds, o = {}) {
  const { isAll = false } = o;
  if (!ds) return null;
  return _.filter(ds, (d) => {
    if (isAll) {
      return d.asset !== '123' && d.asset !== '456';
    }
    return _hasValue(d, 'locked') || _hasValue(d, 'free');
  }).map((d) => {
    return {
      balance_str: d.free,
      balance: _parse(d.free),
      locked_balance_str: d.locked,
      locked_balance: _parse(d.locked),
      coin: d.asset
    };
  });
}

function formatPairs(ds) {
  if (!ds) return null;
  return _.map(ds, (d) => {
    return {
      ...d,
      pair: `${d.baseAsset}-${d.quoteAsset}`
    };
  });
}

function _formatDepth(ds) {
  if (!ds) return null;
  return _.map(ds, (d) => {
    return {
      priceStr: d[0],
      price: _parse(d[0]),
      volumeStr: _parse(d[1]),
      volume: _parse(d[1])
    };
  });
}

function formatPairName(name) {
  if (!name) return null;
  return pairMap[name];
}

function formatPrice(price, symbol) {
  const d = pairInfo[symbol];
  if (!d) {
    console.log(`${symbol}的详细信息找不到...`);
    return null;
  }
  const { filters } = d;
  const PRICE_FILTER = _.filter(filters, f => f.filterType === 'PRICE_FILTER')[0];
  if (!PRICE_FILTER) return `${parseFloat(price, 10).toFixed(6)}00`;
  let { minPrice } = PRICE_FILTER;
  minPrice = parseFloat(minPrice, 10);
  const num = Math.round(Math.log10(1 / minPrice));
  return parseFloat(price, 10).toFixed(num);
}

function formatQuatity(amount, symbol) {
  const d = pairInfo[symbol];
  if (!d) {
    console.log(`${symbol}的详细信息找不到...`);
    return null;
  }
  const { filters } = d;
  const LOT_SIZE = _.filter(filters, f => f.filterType === 'LOT_SIZE')[0];
  if (LOT_SIZE) {
    const stepSize = parseFloat(LOT_SIZE.stepSize, 10);
    amount = Math.floor(amount / stepSize) * stepSize;
    if (stepSize < 1) {
      const num = Math.round(Math.log10(1 / stepSize));
      return amount.toFixed(num);
    } else if (stepSize === 1) {
      return Math.floor(amount);
    }
  } else {
    const q = amount.toFixed(3);
    if (q === '0.000') return `${amount.toFixed(8)}`;
  }
}

function _map(d) {
  const pair = formatPairName(d.symbol);
  if (d.symbol === '123456') return;
  if (!pair) {
    console.log(`binance的币种${d.symbol} 无法翻译为标准symbol... 请联系开发者`);
    return null;
  }
  return {
    pair,
    bid_price: _parse(d.bidPrice),
    bid_volume: _parse(d.bidQty),
    ask_price: _parse(d.askPrice),
    ask_volume: _parse(d.askQty),
    time: new Date()
  };
}

function formatTicks(ds) {
  if (!ds) return null;
  if (Array.isArray(ds)) return _.map(ds, _map).filter(d => d);
  return _map(ds);
}

function formatTicksWS(ds) {
  if (!ds) return null;
  return _.map(ds, (d) => {
    const symbol = d.s;
    const pair = formatPairName(symbol);
    if (d.symbol === '123456') return;
    if (!pair) {
      console.log(`binance的币种${d.s} 无法翻译为标准symbol... 请联系开发者`);
      return null;
    }
    return {
      pair,
      bid_price: _parse(d.b),
      bid_volume: _parse(d.B),
      ask_price: _parse(d.a),
      ask_volume: _parse(d.A),
      price_change: _parse(d.p),
      volume_24: _parse(d.v),
      time: new Date(d.E)
    };
  }).filter(d => d);
}

function formatDepth(ds) {
  return {
    time: new Date(ds.lastUpdateId * 1000),
    bids: _formatDepth(ds.biz),
    asks: _formatDepth(ds.asks),
  };
}

function formatCancelOrderO(o = {}) {
  return {
    symbol: formatPairString(o.pair),
    order_id: o.order_id
  };
}
function formatOrderO(o = {}) {
  const symbol = formatPairString(o.pair);
  const quantity = formatQuatity(o.amount, symbol);
  const isLimit = o.price || o.type === 'LIMIT';
  const price = formatPrice(o.price, symbol);
  if (isLimit && !price) return null;
  const opt = {
    symbol,
    quantity,
    side: o.side,
    type: o.type || 'LIMIT',
    ...(
      isLimit ? {
        price,
        timeInForce: 'GTC'
      } : {}
    ),
  };
  return opt;
}

function formatActiveOrders(ds) {
  return _.map(ds, (d) => {
    return {
      ...d,
      pair: formatPairName(d.symbol)
    };
  });
}

function updatePairs(pairs) {
  _.forEach(pairs, (d) => {
    const { pair, symbol, filters } = d;
    pairMap[symbol] = pair;
    pairInfo[symbol] = {
      ...d,
      ...(_.keyBy(filters, d => d.filterType))
    };
  });
}

function testOrder(o) {
  const { symbol, ammout, price } = o;
  const nominal = price * ammout;
  const info = pairInfo[symbol];
  const { MIN_NOTIONAL } = info;
  if (nominal < MIN_NOTIONAL) return false;
  return true;
}

module.exports = {
  formatPair,
  formatKline,
  formatBalances,
  formatPairs,
  formatDepth,
  formatTicks,
  formatTicksWS,
  //
  formatOrderO,
  formatCancelOrderO,
  formatActiveOrders,
  //
  updatePairs,
  //
  testOrder,
};
