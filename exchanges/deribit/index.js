// const Utils = require('./utils');
// const deepmerge = require('deepmerge');
const crypto = require('crypto');
const _ = require('lodash');
const error = require('./errors');
const Base = require('./../base');
const kUtils = require('./utils');
const Utils = require('./../../utils');
const request = require('./../../utils/request');
// const { exchangePairs } = require('./../data');
const { USER_AGENT, WS_BASE, SPOT_REST_BASE, USDT_CONTRACT_REST_BASE, COIN_CONTRACT_REST_BASE } = require('./config');
const apiConfig = require('./meta/api');

const future_pairs = require('./meta/future_pairs.json');
// const swapUtils = require('./utils/swap');
// const spotUtils = require('./utils/spot');
// const futureUtils = require('./utils/future');

async function delay(t) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t);
  });
}

// const { patch } = require('request');

//
// const recvWindow = 5000;

function _parse(v) {
  return parseFloat(v, 10);
}

function klinePageFilter(d) {
  return d.close && d.open;
}
const { checkKey } = Utils;
//

// function mergeArray(data, d) {
//   return data.concat(data, d);
// }


class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.name = 'deribit';
    this.options = { ...Exchange.options, ...options };
    this.init();
  }
  async init() {
    this.Utils = kUtils;
    this.loadFnFromConfig(apiConfig);
    this.initWs();
  }
  _getTime() {
    return new Date().toISOString();
  }
  //
  initWs(o = {}) {
    if (!this.ws) {
      try {
        this.ws = kUtils.ws.genWs(WS_BASE, { proxy: this.proxy, apiKey: this.apiKey, apiSecret: this.apiSecret });
        this.ws.login();
      } catch (e) {
        console.log(e, 'initWs error');
        process.exit();
      }
    }
  }
  async wsSubscribe({ endpointCompile, opt, o, sign, name }, cb, { formatFn }) {
    if (sign) await this.ws.checkWsLogin();
    await this.ws.subscribe({ method: endpointCompile, params: opt }, (data) => {
      data = this.checkAndProcess(data, { name, type: 'ws' });
      if (data && !data.error && formatFn) data = formatFn(data, o);
      cb(data);
    });
  }

  checkAndProcess(body, { name, type = 'ws_rest' }) {
    if (!body) return { error: `API❌: ${name}: body 返回为空...` };
    if (body.error) return { error: `API❌: ${name}: ${body.error.message}...` };
    let data;
    if (type === 'ws_rest') data = body.result;
    if (type === 'ws') data = _.get(body, 'params.data');
    return data || { error: `API❌: ${name}: data 返回为空...` };
  }
  async queryFunc({ endpointCompile, opt, sign, name }) {
    if (sign) await this.ws.checkWsLogin();
    const body = await this.ws.send({ method: endpointCompile, params: opt });
    return this.checkAndProcess(body, { name });
  }
}

Exchange.options = {
  recvWindow: 5000
};

module.exports = Exchange;

