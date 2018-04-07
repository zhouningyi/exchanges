
const _ = require('lodash');
const allPairs = require('./all_pairs.json');


function formatExchangeName(name) {
  return name.toLowerCase().replace(/ /g, '_');
}

const exchangePairs = _.groupBy(allPairs, d => formatExchangeName(d.exchange));

module.exports = {
  exchangePairs
};
