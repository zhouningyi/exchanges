// const Utils = require('./utils');
const url = require('url');
const Base = require('./../base');
const request = require('./../../utils/request');
const crypto = require('crypto');
const moment = require('moment');
const md5 = require('md5');
const _ = require('lodash');
const Utils = require('./../../utils');
const tUtils = require('./utils');
const WebSocket = require('ws');

const loopInterval = 1000 * 60 * 60;

const { checkKey } = Utils;
// /market
const REST_URL = 'https://ftx.com';
const USER_AGENT = 'Mozilla/4.0 (compatible; Node Binance API)';
const CONTENT_TYPE = 'application/x-www-form-urlencoded';
const {  WS_BASE, REST_BASE } = require('./config');

// const WS_BASE = 'wss://ftx.com/ws/';
//
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'
};

// parse Data
function processWsData(data) {
  if (data instanceof String) {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.log(e, 'String parse json error');
    }
    return data;
  } else {
    try {
      data =JSON.parse(pako.inflate(data, {to:'string'}));
      return data;
    } catch (e) {
      console.log(e, 'pako parse error...');
    }
  }
  return false;
}
function loop(fn, time) {
  fn();
  setTimeout(() => loop(fn, time), time);
}
const onceLoop = _.once(loop);

const subscribe = Utils.ws.genSubscribe(WS_BASE);

class Exchange extends Base {
  constructor(o, options) {
    super(o, options);
    this.name = 'ftx';
    this.init();
  }
  async init() {
    // const pairs = await this.pairs();
    // const ps = tUtils.getPairObject(pairs);
    // this.saveConfig(ps, 'pairs');
  }
  time() {
    return  new Date().getTime().toString();
  }

  //balances
  async balances(o = {}) {
    const endpoint = 'wallet/balances';
    const ds = await this.get(endpoint, o, true);
    return tUtils.formatBalance(ds);
  }

  async cancelOrder(o) {
    checkKey(o, ['order_id']);
    o = tUtils.formatCancelOrderO(o);
    const ds = await this.post(`orders/${o.order_id}/submit-cancel`, o, true, true);
    if (ds && ds.status === 0) {
      return {
        order_id: o.order_id,
        status: 'CANCEL'
      };
    }
    return null;
  }
  async cancelAllOrders(o = {}) {
    checkKey(o, ['pair']);
    const os = await this.orders({
      pair: o.pair,
      status: 'UNFINISH'
    });
    const tasks = _.map(os, o => this.cancelOrder({ order_id: o.order_id }));
    await Promise.all(tasks);
  }
  async orders(o = {}) {
    checkKey(o, ['pair']);
    const opt = tUtils.formartOrdersO(o);
    const ds = await this.get('orders', opt, true, true);
    return tUtils.formartOrders(ds);
  }

  _getHeader(url,endpoint, method = 'GET', o) {
    const t = new Date().getTime().toString();
    let str = `${t}${method.toUpperCase()}/api${endpoint}`;
    console.log(str,'str')
    if (method !== 'GET') {
      const ps = Utils.getQueryString(o);
      if (ps) str = `${str}${ps}`;
    }
    // str = new Buffer(str).toString('base64');
    const signtmp = crypto.createHmac('sha256', this.apiSecret).update(str).digest('hex');
    const headers = {
      'FTX-KEY': this.apiKey,
      'FTX-SIGN': signtmp,
      'FTX-TS': t,
    };
    if (method === 'POST') {
      headers['Content-Type'] = 'application/json;charset=UTF-8';
    }
    return headers;
  }

  async request(method = 'GET', endpoint, params = {}, isSign, isTimestamp) {
    const { options } = this;
    params = tUtils.formatPair(params);
    let url = `https://${REST_BASE}${endpoint}`;
    if (method === 'GET') {
      const qstr = Utils.getQueryString(params);
      if (qstr) url = `${url}?${qstr}`;
    } else if (method === 'POST') {
    }
    const headers = isSign ? this._getHeader(url,endpoint, method, params) : {};
    const o = {
      timeout: options.timeout,
      uri: url,
      proxy: this.proxy,
      method,
      headers,
      ...(method === 'POST' ? { body: JSON.stringify(params) } : {})
    };
    console.log(o);
    //
    let body;
    try {
      // console.log('request', o);
      body = await request(o);
      // console.log(body, 'body...');
    } catch (e) {
      if (e) console.log('request...',e, e.message || e);
      return null;
    }
    const error = body.msg;
    if (error) throw error;
    return body.result || body;
  }
  getWsSign(){
    const t = new Date().getTime();
    console.log(t,'111')
    let strForSign = `${t}${'websocket_login'}`;
    const signatureResult = crypto.createHmac('sha256',this.apiSecret)
      .update(strForSign)
      .digest('hex');
    console.log(signatureResult);
    return signatureResult; 
}
  // 公用一个ws
  async init(options,isSign){
    const t = new Date().getTime();
    console.log(this.time(),'........')
    const login = {'op':'login','args':{'key':this.apiKey,'sign':this.getWsSign(),'time':t}}
    try{
        const ws = this.ws = new WebSocket(WS_BASE);
        isSign===true?this._addHooks(ws,[login,options]):this._addHooks(ws,options);
    } catch(e){
        console.log(e,`ws建立出错，正在尝试restart....`);
        await this.init(stream,options)
    }
  }
  restart() {
    this.init();
}
_addHooks(ws,o = {}){
    // console.log('_addhooks',o)
    const { pingInterval = 1000*15 } = o;
    ws.tryPing = (noop) =>{
        try {
            ws.ping(noop)
        } catch (e) {
            console.log(e,'ping error');
            process.exit();
        }
    };
    ws.on('open',()=>{
        this._isReady = true;
        for(var i=0;i<o.length;i++){
          ws.send(JSON.stringify(o[i]))
        }
        // ws.send(JSON.stringify(o))
        if(pingInterval) loop(noop=>ws.tryPing(noop),pingInterval);
    });
    ws.on('peng',()=>{
        console.log('peng');
    });
    ws.on('error',(e)=>{
        console.log(`【error】：${e},====`);
        // process.exit();
        this._isReady = false;
        return this.restart()
    });
    ws.on('close',(e)=>{
        console.log(e,'close');
        this._isReady = false;
        return this.restart();
    });
    ws.on('message',(data)=>{
    // data = processWsData(data);
    console.log(JSON.parse(data));
        try {
            if (typeof data === 'string') data = JSON.parse(data);
            // this.checkLogin(data);
            // this._onCallback(data, ws);
          } catch (error) {
            console.log(`ws Parse json error: ${error.message}`);
            process.exit();
          }
          onceLoop(() => {
            ws.tryPing();
          }, loopInterval);
    })
};
}

module.exports = Exchange;
