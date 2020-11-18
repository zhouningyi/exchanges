
const _ = require('lodash');

const unique = require('./unique');
const morph = require('./morph');
const Console = require('./console');
const ws = require('./ws');
const fn = require('./fn');
const base = require('./base');
const time = require('./time');
const formatter = require('./formatter');


function getQueryString(params, isEncode = false) {
  params = _.map(params, (value, key) => ({ value, key }));
  params = _.sortBy(params, d => d.key);
  return _.map(params, ({ value, key }) => {
    if (Array.isArray(value)) {
      return _.map(value, (_value) => {
        return `${key}=${isEncode ? encodeURIComponent(_value) : _value}`;
      }).join('&');
    }
    return `${key}=${isEncode ? encodeURIComponent(value) : value}`;
  }).join('&');
}


function parse(v) {
  return parseFloat(v, 10);
}

function throwError(e) {
  throw new Error(e);
}

function _parse(v) {
  if (v === undefined || v === null) return null;
  return parseFloat(v, 10);
}

module.exports = {
  ...base,
  ...morph,
  ...Console,
  ...fn,
  ...time,
  formatter,
  unique,
  getInstrumentId: formatter.getInstrumentId,
  getQueryString,
  ws,
  parse,
  throwError,
  _parse
};
