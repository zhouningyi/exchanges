
const pub = require('./public');
const future = require('./future');
const spot = require('./spot');

module.exports = {
  ...pub, ...future, ...spot
};
