
const pub = require('./public');
const future = require('./future');
const spot = require('./spot');
const margin = require('./margin');
const ws = require('./ws');
const coin_swap = require('./coin_swap');

module.exports = {
  ...pub, ...future, ...spot, ...margin, ...coin_swap, ws
};
