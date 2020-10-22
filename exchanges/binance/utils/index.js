
const pub = require('./public');
const coin_contract = require('./coin_contract');
const spot = require('./spot');
const error = require('./error');
const ws = require('./_ws');

module.exports = {
  ...pub, ...coin_contract, ...spot, ...error, ws
};
