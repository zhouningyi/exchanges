const _ = require('lodash');
const Utils = require('./../../../utils');
const config = require('./../config');


function errorDetect(e) {
  if (e && !Array.isArray(e) && typeof e === 'object') {
    const { message } = e;
    if (message) {
      throw new Error(message);
    }
  }
}

module.exports = { errorDetect };

