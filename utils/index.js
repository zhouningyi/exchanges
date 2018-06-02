
const _ = require('lodash');

const unique = require('./unique');
const morph = require('./morph');
const Console = require('./console');
const ws = require('./ws');
const fn = require('./fn');
const base = require('./base');

function getQueryString(params, isEncode = false) {
  params = _.map(params, (value, key) => ({ value, key }));
  params = _.sortBy(params, d => d.key);
  return _.map(params, ({ value, key }) => `${key}=${isEncode ? encodeURIComponent(value) : value}`).join('&');
}

function isNull(v) {
  return v === undefined || v === null || v === '';
}

function _handelNull(k) {
  Console.print(`${k}的值不能为空`, 'red');
  process.exit();
}

function checkKey(o, vs) {
  if (Array.isArray(vs)) {
    vs = _.keyBy(vs, v => v);
    _.forEach(vs, (k) => {
      if (isNull(o[k])) _handelNull(k);
    });
  } else if (isNull(o[vs])) _handelNull(vs);
}

module.exports = {
  ...base, ...morph, ...Console, ...fn, unique, getQueryString, checkKey, ws
};
