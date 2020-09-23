
const WebSocket = require('ws');
const url = require('url');
const _ = require('lodash');
const HttpsProxyAgent = require('https-proxy-agent');
const CryptoJS = require('crypto-js');
const pako = require('pako');

const Event = require('bcore/event');
const md5 = require('md5');

async function delay(t) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t);
  });
}

function noop() {}

const loopInterval = 4000;

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
      // data = pako.inflateRaw(data, { to: 'string' });
      return JSON.parse(data);
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


function uuid() {
  return `uuid_${Math.floor(Math.random() * 100000)}`;
}

function messageWrapper(msg) {
  return {
    jsonrpc: '2.0',
    id: msg.id || uuid(),
    ...msg,
  };
}


function resp(data) {
  const res = data && data.result;
  if (!res) return console.log(data, 'resp: result不存在...');
  return res;
}
class WS extends Event {
  constructor(stream, o) {
    super();
    this.stream = stream;
    this.apiSecret = o.apiSecret;
    this.apiKey = o.apiKey;
    this.options = o;
    this._isReady = false;
    this.callbacks = [];
    this.sendSequence = {};
    this.subscribeSequence = {};
    this.init();
  }
  async init() {
    const { stream, options: o } = this;
    const options = o.proxy ? { agent: new HttpsProxyAgent(url.parse(o.proxy)) } : {};
    try {
      const ws = this.ws = new WebSocket(stream, options);
      this.addHooks(ws, o);
    } catch (e) {
      console.log(e, '建立ws出错 重启中...');
      await this.init(stream, o);
    }
  }
  isReady() {
    return this._isReady;
  }
  isLogin() {
    return !!this.refresh_token;
  }
  restart() {
    this.init();
  }
  checkError(data) {
    const { error } = data;
    if (error) {
      const { message } = error;
      console.log(`【${message}】`, 'checkError data...');
    }
  }
  _getNow() {
    return Date.now();
  }
  async login() {
    if (!this.apiSecret) return;
    const timestamp = this._getNow();
    const nonce = 'himalaya';
    const signature = CryptoJS.HmacSHA256(`${timestamp}\n${nonce}\n`, this.apiSecret).toString();
    const msg = {
      id: 'login',
      method: 'public/auth',
      params: {
        grant_type: 'client_signature',
        client_id: this.apiKey,
        timestamp,
        signature,
        nonce,
        data: ''
      }
    };
    await this.checkWsReady();
    let res = await this.send(msg);
    res = resp(res);
    if (!res) return;
    this.refresh_token = res.refresh_token;
    this.access_token = res.access_token;
    //
    const before_interval = 10 * 60 * 1000;
    setTimeout(this.refreshTokenFn, res.expires_in - before_interval);
  }
  refreshTokenFn = async () => {
    const resp = await this.send({
      method: 'public/auth',
      params: {
        grant_type: 'refresh_token',
        refresh_token: this.refresh_token
      }
    });

    this.token = resp.result.access_token;
    this.refreshToken = resp.result.refresh_token;

    if (!resp.result.expires_in) {
      throw new Error('Deribit did not provide expiry details');
    }

    setTimeout(this.refreshTokenFn, resp.result.expires_in - 10 * 60 * 1000);
  }
  addHooks(ws, o = {}) {
    const { pingInterval = 1000 } = o;
    ws.tryPing = (noop) => {
      try {
        ws.ping(noop);
      } catch (e) {
        console.log(e, 'ping error');
        process.exit();
      }
    };
    ws.on('open', (socket) => {
      this._isReady = true;
      if (pingInterval) loop(() => ws.tryPing(noop), pingInterval);
    });
    ws.on('pong', (e) => {
      // console.log(e, 'pong');
    });
    ws.on('ping', () => {
      console.log('ping');
    });
    // ws.on('connection', (socket) => {
    //   console.log(socket, 'socket...');
    // });
    ws.on('error', (e) => {
      console.log(e, 'error');
      process.exit();
      this._isReady = false;
      return this.restart();
    });
    ws.on('close', (e) => {
      // this._isReady = false;
      return this.login();
    });
    ws.on('message', (data) => {
      try {
        data = processWsData(data);
        // console.log(data, 'data............');
        if (typeof data === 'string') data = JSON.parse(data);
        this.checkError(data);
        this.checkCallback(data);
      } catch (error) {
        console.log(`ws Parse json error: ${error.message}`);
        process.exit();
      }
      onceLoop(() => {
        ws.tryPing();
      }, loopInterval);
    });
  }
  checkCallback(data) {
    const id = data.id;
    const channel = _.get(data, 'params.channel');
    if (id) {
      const { sendSequence } = this;
      const line = sendSequence[id];
      if (line) {
        line.callback(data);
      } else {
        console.log(data, `返回的id不可识别: ${id}...`);
      }
    } else if (channel) {
      const line = this.subscribeSequence[md5(channel)];
      if (line) {
        line.callback(data);
      } else {
        console.log(data, `返回的channel不可识别: ${channel}...`);
      }
    }
  }
  async checkWsReady() {
    while (!this.isReady()) {
      await delay(50);
    }
  }
  async checkWsLogin() {
    while (!this.isLogin()) {
      await delay(50);
    }
  }
  async send(msg, callback) {
    if (!msg) return;
    await this.checkWsReady();
    let cancel;
    const p = new Promise((r, rj) => {
      cancel = rj;
      if (!callback) callback = r;
    });
    //
    msg = messageWrapper(msg);
    // console.log(msg, 'send msg......');
    const { sendSequence } = this;
    _.set(sendSequence, msg.id, { ...msg, callback, cancel });
    this._send();
    return p;
  }
  _send() {
    const { sendSequence } = this;
    if (!_.values(sendSequence).length) return;
    _.forEach(sendSequence, (info) => {
      this.ws.send(JSON.stringify(info));
      info.isSend = true;
    });
  }

  async subscribe(msg, callback) {
    if (!msg) return;
    await this.checkWsReady();
    msg = messageWrapper(msg);
    const { channel, ...rest } = msg.params;
    msg.params = { channels: [channel], ...rest };
    _.set(this.subscribeSequence, md5(channel), { ...msg, callback });
    this.sendSequence[msg.id] = { callback: () => { console.log(channel, 'channel receive...'); } };
    this.ws.send(JSON.stringify(msg));
  }
}

function genWs(stream, o = {}) {
  return new WS(stream, o);
}

module.exports = {
  genWs,
};
