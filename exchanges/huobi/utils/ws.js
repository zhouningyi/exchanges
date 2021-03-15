

const _ = require('lodash');
const _ws = require('./_ws');
const { symbol2pair, pair2coin, pair2symbol, formatCoin, orderStatusMap, formatDepth } = require('./public');
const { checkKey, formatter, getSwapFundingTime } = require('./../../../utils');
const futureUtils = require('./future');
const spotUtils = require('./spot');
const coinSwapUtils = require('./coin_swap');
const usdtSwapUtils = require('./usdt_swap');

const exchange = 'HUOBI';

function _parse(v) {
  return parseFloat(v, 10);
}
function exist(d) {
  return !!d;
}

function final(f, l) {
  return (d) => {
    d = f(d, l);
    if (d) {
      for (const k in d) {
        if (d[k] === undefined) delete d[k];
      }
    }
    return d;
  };
}

function _getChanelObject(name, api, type = 'sub') {
  const o = {};
  o[type] = name;
  o.id = `${api}_${Math.floor(Math.random() * 10000)}`;
  return o;
}

function _pair2symbol(pair, isFuture) {
  if (isFuture) {
    pair = pair.replace('USDT', 'USD');
  } else if (pair.endsWith('USD')) {
    pair = `${pair}T`;
  }
  return pair.split('-').join('').toLowerCase();
}

function _depthCh2pair(ch) {
    // market.btcusdt.mbp.refresh.5
  return symbol2pair(ch.split('.mbp.')[0].replace('market.', ''));
}

const spotDepth = {
  name: 'spotDepth',
  // notNull: ['assets'],
  isSign: false,
  chanel: (o) => {
    const { level = 5 } = o;
    return _.map(o.assets, ({ pair }) => {
      const ch = `market.${_pair2symbol(pair)}.mbp.refresh.${level}`;
      return _getChanelObject(ch);
    });
  },
  validate: (res) => {
    return res && res.ch && res.ch.startsWith('market.') && res.ch.indexOf('mbp.refresh') !== -1;
  },
  formater: (res) => {
    const { ts, tick, ch } = res;
    const pair = _depthCh2pair(ch);
    const { asks, bids } = tick;
    return formatter.wrapperInstrumentId({
      asset_type: 'SPOT',
      exchange,
      pair,
      time: new Date(ts),
      bids: formatDepth(bids),
      asks: formatDepth(asks),
    });
  }
};

function formatWsSpotBalance(d) {
  if (!d || !d.currency) return null;
  const res = {
    exchange: 'HUOBI',
    asset_type: 'SPOT',
    balance_type: 'SPOT',
    balance: _parse(d.balance || d.available),
    coin: formatCoin(d.currency),
    account_id: d.accountId,
  };
  if (d.changeTime) res.time = new Date(d.changeTime);
  res.balance_id = formatter.getBalanceId(res);
  return res;
}

const spotBalance = {
  topic: 'accounts',
  notNull: [],
  chanel: (o, o1) => {
    return [{ action: 'sub', ch: 'accounts.update#1' }];
  },
  validate: o => o && o.ch && o.ch.startsWith('accounts'),
  isSign: true,
  formater: (ds) => {
    const { data, ch } = ds;
    if (!data) return null;
    const res = [formatWsSpotBalance(data)].filter(d => d);
    // const btc = _.filter(res, d => d.coin === 'BTC')[0];
    // if (btc)console.log(_.get(btc, 'balance'), 'spot ws...');
    return res;
  }
};

const spotOrders = {
  version: 'v2',
  topic: 'orders',
  notNull: [],
  chanel: (o, o1) => {
    checkKey(o1, ['assets']);
    return _.map(o1.assets, ({ pair }) => ({ action: 'sub', ch: `orders#${_pair2symbol(pair)}` }));
  },
  validate: o => o && o.ch && o.ch.startsWith('orders#'),
  isSign: true,
  formater: (d) => {
    if (!d || !d.data || !_.values(d.data).length) return null;
    d = d.data;
    const res = { asset_type: 'SPOT', exchange };
    if (d.orderSize) res.amount = _parse(d.orderSize);
    if (d.execAmt) res.filled_amount = _parse(d.execAmt);
    if (d.lastActTime) res.server_updated_at = new Date(d.lastActTime);
    if (d.orderId) res.order_id = `${d.orderId}`;
    if (d.orderSource) res.source = d.orderSource;
    if (d.orderPrice) res.price = _parse(d.orderPrice);
    if (d.clientOrderId) res.client_oid = `${d.clientOrderId}`;
    if (d.orderStatus) res.status = orderStatusMap[d.orderStatus];
    if (d.symbol) res.pair = symbol2pair(d.symbol);
    return { ...res, ...spotUtils.getSpotOrderProps(d) };
  }
};

const futureOrders = {
  notNull: [],
  chanel: (o) => {
    return [{ op: 'sub', topic: 'orders.*' }];
  },
  validate: o => o && o.topic && o.topic.startsWith('orders'),
  isSign: true,
  formater: (ds) => {
    if (!ds) return false;
    return futureUtils.formatFutureOrder(ds);
  }
};

function uuid(str) {
  return `${str}.${Math.floor(Math.random() * 100000)}`;
}
const futurePosition = {
  notNull: [],
  chanel: (o) => {
    return [{
      op: 'sub',
      cid: uuid('position'),
      topic: 'positions.*',
    }];
  },
  validate: o => o && o.topic && o.topic.startsWith('positions'),
  isSign: true,
  formater: (ds) => {
    if (!ds) return false;
    const { data, topic } = ds;
    if (topic === 'positions') return false;// 第一次订阅的时候 lever rate是错的。。
    if (!data) return false;
    const isws = true;
    const res = futureUtils.futurePositions(data, {}, isws);
    return res;
  }
};

const futureBalance = {
  notNull: [],
  chanel: (o) => {
    return [{
      op: 'sub',
      topic: 'accounts.*',
    }];
  },
  validate: o => o && o.topic && o.topic.startsWith('accounts'),
  isSign: true,
  formater: (ds) => {
    if (!ds) return false;
    const { data, topic } = ds;
    if (!data) return false;
    const res = futureUtils.futureBalances(data);
    // console.log(data, res, 'res.....');
    // const btc = _.filter(res, d => d.coin === 'BTC')[0];
    // if (btc)console.log(btc.balance, 'future ws...');
    return res;
  }
};

const futureSymbolMap = {
  this_week: 'CW',
  next_week: 'NW',
  quarter: 'CQ',
  next_quarter: 'NQ'
};

const rFutureSymbolMap = _.invert(futureSymbolMap);

function getFutureSymbol(pair, contract_type) {
  const coin = pair2coin(pair);
  return `${coin}_${futureSymbolMap[contract_type.toLowerCase()]}`;
}

function _futureDepthCh2pair(ch) {
  const chs = ch.replace('market.', '').split('.depth.')[0];
  const arr = chs.split('_');
  const [coin, str] = arr;
  const contract_type = rFutureSymbolMap[str];
  const asset_type = contract_type.toUpperCase();
  const pair = `${arr[0]}-USD`;
  return { contract_type, asset_type, pair, coin };
}

const futureDepth = {
  name: 'futureDepth',
  notNull: ['assets'],
  isSign: false,
  chanel: (o) => {
    return _.map(o.assets, ({ pair, asset_type }) => {
      return _getChanelObject(`market.${getFutureSymbol(pair, asset_type)}.depth.${o.type || 'step0'}`, 'depth', 'sub');
    });
  },
  validate: o => o && o.ch && o.ch.startsWith('market') && o.ch.indexOf('.depth') !== -1,
  formater: (ds) => {
    const { ts, tick, ch } = ds;
    const info = _futureDepthCh2pair(ch);
    const { asks, bids } = tick;
    const res = {
      exchange,
      ...info,
      time: new Date(ts),
      bids: futureUtils.formatFutureDepth(bids),
      asks: futureUtils.formatFutureDepth(asks),
    };
    formatter.wrapperInstrumentId(res);
    return res;
  }
};


const futureTicks = {
  name: 'futureTicks',
  notNull: ['pairs', 'contract_type'],
  isSign: false,
  chanel: (o) => {
    let { contract_type, pairs } = o;
    if (!Array.isArray(contract_type)) contract_type = [contract_type];
    const ctrs = [];
    _.forEach(pairs, (pair) => {
      _.forEach(contract_type, (c) => {
        const str = `market.${getFutureSymbol(pair, c)}.${o.type || 'detail'}`;
        ctrs.push(str);
      });
    });
    return _.map(ctrs, ctr => _getChanelObject(ctr, 'detail', 'sub'));
  },
  validate: o => o && o.ch && o.ch.startsWith('market') && o.ch.indexOf('.detail') !== -1,
  formater: (ds) => {
    const { ts, tick } = ds;
    return [{
      unique_id: `${tick.id}`,
      time: new Date(ts),
      low: _parse(tick.low),
      high: _parse(tick.high),
      open: _parse(tick.open),
      close: _parse(tick.close),
      count: _parse(tick.count),
      volume: _parse(tick.vol),
      amount: _parse(tick.amount),
    }];
  }
};


function _depthCh2SwapPair(ch) {
  return ch.split('.depth.')[0].replace('market.', '');
}

const coinSwapDepth = {
  name: 'coinSwapDepth',
  // notNull: ['assets'],
  isSign: false,
  chanel: (o) => {
    return _.map(o.assets, ({ pair }) => {
      const ch = `market.${pair}.depth.step0`;
      const res = _getChanelObject(ch, 'coinSwapDepth');
      return res;
    });
  },
  validate: (res) => {
    return res && res.ch && res.ch.startsWith('market.') && res.ch.indexOf('depth') !== -1;
  },
  formater: (res) => {
    const { ts, tick, ch } = res;
    const pair = _depthCh2SwapPair(ch);
    const { asks, bids } = tick;
    return formatter.wrapperInstrumentId({
      asset_type: 'SWAP',
      exchange,
      pair,
      time: new Date(ts),
      bids: formatDepth(bids),
      asks: formatDepth(asks),
    });
  }
};

// const coinSwapIndex

function _estfundingCh2SwapPair(ch) {
  return ch.split('.estimated_rate.')[0].replace('market.', '');
}
const coinSwapEstimateFunding = {
  name: 'coinSwapEstimateFunding',
  isSign: false,
  chanel: (o) => {
    return _.map(o.assets, ({ pair }) => {
      const ch = `market.${pair}.estimated_rate.1min`;
      return _getChanelObject(ch, 'coinSwapDepth');
    });
  },
  validate: (res) => {
    return res && res.ch && res.ch.startsWith('market.') && res.ch.indexOf('estimated_rate') !== -1;
  },
  formater: (res) => {
    const { ts, tick, ch } = res;
    const pair = _estfundingCh2SwapPair(ch);
    const h8 = 3600 * 1000 * 8;
    const current_funding_time = getSwapFundingTime({ exchange, asset_type: 'SWAP', pair });
    const next_funding_time = new Date(current_funding_time.getTime() + h8 * 2);
    return formatter.wrapperInstrumentId({
      asset_type: 'SWAP',
      exchange,
      pair,
      time: new Date(ts),
      estimated_rate: _parse(tick.close),
      next_funding_time
    });
  }
};

const coinSwapOrders = {
  notNull: [],
  chanel: (o) => {
    return [{ op: 'sub', topic: 'orders.*' }];
  },
  validate: (o) => {
    return o && o.topic && o.topic.startsWith('orders');
  },
  isSign: true,
  formater: (ds) => {
    if (!ds) return null;
    return coinSwapUtils.formatCoinSwapOrder(ds);
  }
};

const usdtSwapOrders = {
  ...coinSwapOrders,
  chanel: (o) => {
    return [{ op: 'sub', topic: 'orders_cross.*' }];
  },
  validate: (o) => {
    return o && o.topic && o.topic.startsWith('orders_cross');
  },
  formater: (ds) => {
    if (!ds) return null;
    return usdtSwapUtils.formatUsdtSwapOrder(ds);
  }
};

const coinSwapBalance = {
  notNull: [],
  chanel: o => [{ op: 'sub', topic: 'accounts.*' }],
  validate: o => o && o.topic && o.topic.startsWith('accounts'),
  isSign: true,
  formater: (ds) => {
    if (!ds) return false;
    const { data, topic } = ds;
    if (!data) return false;
    const res = _.map(data, coinSwapUtils.formatCoinSwapBalance);
    return res;
  }
};

const usdtSwapBalance = {
  ...coinSwapBalance,
  chanel: o => [{ op: 'sub', topic: 'accounts_cross.*' }],
  validate: o => o && o.topic && o.topic.startsWith('accounts_cross'),
  formater: (ds) => {
    if (!ds) return false;
    const { data, topic } = ds;
    if (!data) return false;
    const res = _.map(data, usdtSwapUtils.formatUsdtSwapBalance);
    return res;
  }
};

const coinSwapPosition = {
  notNull: [],
  chanel: (o) => {
    return [{ op: 'sub', cid: uuid('position'), topic: 'positions.*' }];
  },
  validate: o => o && o.topic && o.topic.startsWith('positions'),
  isSign: true,
  formater: (ds) => {
    if (!ds) return null;
    const { data, topic } = ds;
    if (!data) return null;
    const res = coinSwapUtils.formatSwapCoinPositions(data);
    if (topic === 'positions') {
      _.forEach(res, (d) => {
        delete d.lever_rate;// 第一次订阅的时候 lever rate是错的。。
      });
    }
    return res;
  }
};

const usdtSwapPosition = {
  ...coinSwapPosition,
  chanel: (o) => {
    return [{ op: 'sub', cid: uuid('positions_cross'), topic: 'positions_cross.*' }];
  },
  validate: o => o && o.topic && o.topic.startsWith('positions_cross'),
  formater: (ds) => {
    if (!ds) return null;
    const { data, topic } = ds;
    if (!data) return null;
    const res = usdtSwapUtils.formatUsdtSwapPositions(data);
    if (topic === 'positions') {
      _.forEach(res, (d) => {
        delete d.lever_rate;// 第一次订阅的时候 lever rate是错的。。
      });
    }
    return res;
  }
};

module.exports = {
  ..._ws,
  usdtSwapEstimateFunding: coinSwapEstimateFunding,
  coinSwapEstimateFunding,
  coinSwapBalance,
  usdtSwapBalance,
  coinSwapPosition,
  usdtSwapPosition,
  coinSwapOrders,
  usdtSwapOrders,
  coinSwapDepth,
  usdtSwapDepth: coinSwapDepth,
  // spot
  // ticks,
  spotDepth,
  spotOrders,
  futureOrders,
  spotBalance,
  getChanelObject: _getChanelObject,
  // coinSwapOrders,
  futureDepth,
  futureTicks,
  // // reqBalance,
  // // future
  // futureIndex,
  // futureTicks,
  futureBalance,
  // futureDepth,
  futurePosition,
  // swapTicks,
  // swapDepth
};
