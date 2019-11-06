
const pub = require('./public');
const spot = require('./spot');
const ws = require('./ws');

module.exports = {
  ...pub, ...spot, ws,
};
