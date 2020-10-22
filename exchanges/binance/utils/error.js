
const _ = require('lodash');
// const md5 = require('md5');
//


function getError(d) {
  if (d && d.error) return d.error;
}

module.exports = {
  getError
};
