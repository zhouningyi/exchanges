
const pub = require('./public');
const future = require('./future');
const spot = require('./spot');
const margin = require('./margin');

module.exports = {
  ...pub, ...future, ...spot, ...margin
};
