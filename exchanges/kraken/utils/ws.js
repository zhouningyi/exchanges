

const _ = require('lodash');
const { symbol2pair } = require('./public');
const { checkKey } = require('./../../../utils');
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

function formatPair(pair) {
  return pair.replace('-', '/');
}

// 现货tick
const ticks = {
  name: 'ticker',
  isSign: false,
  notNull: ['pairs'],
  chanel: (o = {}) => _.map(o.pairs, p => p.replace('-', '/')),
  formater: res => res,
};


function getContractTypeFromO(o) {
  let { contract_type } = o;
  if (typeof contract_type === 'string') contract_type = [contract_type];
  return contract_type;
}

module.exports = {
  ticks,
  getChanelObject: _getChanelObject
}

