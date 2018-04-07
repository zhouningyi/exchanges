const _ = require('lodash');
const { coinMap } = require('./meta');
const Utils = require('./../../utils');

const { floor } = Math;

function formatTick(d) {
  return {
    bidPrice: parseFloat(d.sell_price, 10),
    askPrice: parseFloat(d.buy_price, 10),
    time: new Date(d.time)
  };
}

module.exports = {
  formatTick
};
