
const pub = require('./public');
const future = require('./future');
const spot = require('./spot');
const margin = require('./margin');
const ws = require('./ws');
const coin_swap = require('./coin_swap');
const usdt_swap = require('./usdt_swap');


module.exports = {
  ...pub, ...future, ...spot, ...margin, ...coin_swap, ...usdt_swap, ws
};
