// const Utils = require('./utils');
const Base = require('./../base');
const request = require('request');
const crypto = require('crypto');
const _ = require('lodash');
const kUtils = require('./utils');
const Utils = require('./../../utils');
//
const REST_URL = 'https://api.binance.com';
class Exchange extends Base {
  constructor(options) {
    super(options);
    this.url = URL;
    this.version = '/api/v1';
  }
}

module.exports = Exchange;
