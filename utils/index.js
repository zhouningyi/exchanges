
const _ = require('lodash');

const morph = require('./morph');
const Console = require('./console');

function getQueryString(params) {
  params = _.map(params, (value, key) => ({ value, key }));
  params = _.sortBy(params, d => d.key);
  return _.map(params, ({ value, key }) => `${key}=${value}`).join('&');
}

module.exports = {
  ...morph, ...Console, getQueryString
};
