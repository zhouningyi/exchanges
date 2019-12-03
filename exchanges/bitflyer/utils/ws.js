

const _ = require('lodash');
const { formatPair } = require('./public');
const { checkKey } = require('../../../utils');
const spotUtils = require('./spot');

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

function _getChanelObject(args, event = 'subscribe') {
  const { pairs, name, ...other } = args;
  return { 
    event,
    pair: _.map(pairs, formatPair),
    subscription: {
      name: name,
      ...other
    }
  };
}

// 现货tick
const ticks = {
  name: 'ticker',
  isSign: false,
  notNull: ['pairs'],
  chanel: (o = {}) => _.map(o.pairs, p => formatPair(p)),
  formater: res => Array.isArray(res) ? spotUtils.formatSpotTick(res[1], { pair: res[3] }) : res,
};

// kline
const ohlc = {
  name: 'ohlc',
  isSign: false,
  notNull: ['pairs', 'interval'],
  chanel: (o = {}) => _.map(o.pairs, p => formatPair(p)),
  formater: res =>  Array.isArray(res) ? spotUtils.formatSpotKline(res[1], { pair: res[3], interval: res[2].split('-')[1] }) : res,
};

// depth

const depth = {
  name: 'depth',
  isSign: false,
  notNull: ['pairs'],
  event: 'updated',
  chanel: (o = {}) => [`price_ladders_cash_${formatPair(o.pair)}_buy`, `price_ladders_cash_${formatPair(o.pair)}_sell`],
  formater: (res, o) =>  spotUtils.formatDepth(res, o),
};

function getContractTypeFromO(o) {
  let { contract_type } = o;
  if (typeof contract_type === 'string') contract_type = [contract_type];
  return contract_type;
}

module.exports = {
  ticks,
  ohlc,
  depth,
  getChanelObject: _getChanelObject
}

