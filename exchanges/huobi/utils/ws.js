

const _ = require('lodash');
const _ws = require('./_ws');
const { symbol2pair, pair2coin, pair2symbol } = require('./public');
const { checkKey } = require('./../../../utils');
const futureUtils = require('./future');
const spotUtils = require('./spot');
const swapUtils = require('./swap');

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
  return symbol2pair(ch.split('.depth')[0].replace('market.', ''));
}

const spotDepth = {
  name: 'spotDepth',
  notNull: ['pairs'],
  isSign: false,
  chanel: (o) => {
    const ctrs = _.map(o.pairs, pair => `market.${_pair2symbol(pair)}.depth.${o.type || 'step0'}`);
    const res = _.map(ctrs, (ctr) => {
      return _getChanelObject(ctr, 'depth', 'sub');
    });
    return res;
  },
  validate: (res) => {
    return res && res.ch && res.ch.startsWith('market.') && res.ch.indexOf('depth.step') !== -1;
  },
  formater: (res) => {
    const { ts, tick, ch } = res;
    const pair = _depthCh2pair(ch);
    const { asks, bids } = tick;
    return [{
      pair,
      exchange: 'huobi',
      time: new Date(ts),
      bids: spotUtils.formatDepth(bids),
      asks: spotUtils.formatDepth(asks),
    }];
  }
};


const spotBalance = {
  topic: 'accounts',
  notNull: [],
  chanel: (o, o1) => {
    return [{
      op: 'sub',
      topic: 'accounts',
      model: '1'
    }, {
      op: 'req',
      topic: 'accounts.list',
    }];
  },
  validate: o => o && o.topic && o.topic.startsWith('accounts'),
  isSign: true,
  formater: (ds) => {
    const { data, topic } = ds;
    // console.log(topic, 'balance topic...');
    if (!data) return false;
    let res = [];
    if (topic === 'accounts.list') {
      const group = _.groupBy(data, 'type');
      const { point, spot } = group;
      _.forEach(spot, (s) => {
        const _res = spotUtils.processBalance(s.list);
        res = res.concat(_res);
      });
      _.forEach(point, (s) => {
        const _res = spotUtils.processBalance(s.list);
        res = res.concat(_res);
      });
      return res;
    } else if (topic === 'accounts') {
      const result = spotUtils.processBalance(data.list);
      // console.log(result, 'spotBalance....');
      return result;
    }
    return false;
  }
};

const spotOrders = {
  topic: 'orders',
  notNull: [],
  chanel: (o, o1) => {
    checkKey(o1, ['pairs']);
    const { pairs } = o1;
    const symbol = _.map(pairs, _pair2symbol);// .join(',');
    return [{
      op: 'sub',
      topic: 'orders.*.update',
    }, ..._.map(symbol, (s) => {
      return {
        op: 'req',
        symbol: s,
        topic: 'orders.list',
        'account-id': o1.spotId,
        states: 'submitted,partial-filled,partial-canceled,filled,canceled'
      };
    })];
  },
  validate: o => o && o.topic && o.topic.startsWith('orders'),
  isSign: true,
  formater: (ds) => {
    const { data, topic } = ds;
    if (!data) return false;
    if (topic === 'orders.list') {
      return _.map(data, spotUtils.formatSpotWsOrder);
    } else if (topic.endsWith('.update')) {
      return [spotUtils.formatSpotWsOrder(data)];
    }
    return false;
  }
};

const futureOrders = {
  notNull: [],
  chanel: (o) => {
    return [{
      op: 'sub',
      topic: 'orders.*',
    }];
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
    // console.log(topic, 'future_balance_topic...');
    if (!data) return false;
    const res = futureUtils.futureBalances(data);
    return res;
  }
};

const futureSymbolMap = {
  this_week: 'CW',
  next_week: 'NW',
  quarter: 'CQ'
};

const rFutureSymbolMap = _.invert(futureSymbolMap);

function getFutureSymbol(pair, contract_type) {
  const coin = pair2coin(pair);
  return `${coin}_${futureSymbolMap[contract_type]}`;
}

function _futureDepthCh2pair(ch) {
  const chs = ch.replace('market.', '').split('.depth.')[0];
  const arr = chs.split('_');
  const [coin, str] = arr;
  const contract_type = rFutureSymbolMap[str];
  const pair = `${arr[0]}-USD`;
  return { contract_type, pair, coin };
}


const futureDepth = {
  name: 'futureDepth',
  notNull: ['pairs', 'contract_type'],
  isSign: false,
  chanel: (o) => {
    let { contract_type, pairs } = o;
    if (!Array.isArray(contract_type)) contract_type = [contract_type];
    const ctrs = [];
    _.forEach(pairs, (pair) => {
      _.forEach(contract_type, (c) => {
        const str = `market.${getFutureSymbol(pair, c)}.depth.${o.type || 'step0'}`;
        ctrs.push(str);
      });
    });
    const res = _.map(ctrs, (ctr) => {
      return _getChanelObject(ctr, 'depth', 'sub');
    });
    return res;
  },
  validate: o => o && o.ch && o.ch.startsWith('market') && o.ch.indexOf('.depth') !== -1,
  formater: (ds) => {
    const { ts, tick, ch } = ds;
    const info = _futureDepthCh2pair(ch);
    const { asks, bids } = tick;
    const res = [{
      exchange: 'huobi',
      ...info,
      time: new Date(ts),
      bids: futureUtils.formatFutureDepth(bids),
      asks: futureUtils.formatFutureDepth(asks),
    }];
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

// const swapTicks = {
//   name: 'swap/ticker',
//   isSign: false,
//   notNull: ['pairs'],
//   chanel: o => _.map(o.pairs, pair => `swap/ticker:${pair}-SWAP`),
//   formater: ds => _.map(ds.data, final(swapUtils.formatTick))
// };

// const swapDepth = {
//   name: 'swap/depth5',
//   isSign: false,
//   notNull: ['pairs'],
//   chanel: o => _.map(o.pairs, pair => `swap/depth5:${pair}-SWAP`),
//   formater: res => futureUtils.formatFutureDepth(res.data, 'swap')
// };


module.exports = {
  ..._ws,
  // spot
  // ticks,
  spotDepth,
  spotOrders,
  futureOrders,
  spotBalance,
  getChanelObject: _getChanelObject,
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
