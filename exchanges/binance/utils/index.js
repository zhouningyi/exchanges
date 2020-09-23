
const pub = require('./public');
const coin_contract = require('./coin_contract');
const spot = require('./spot');

module.exports = {
  ...pub, ...coin_contract, ...spot
};
