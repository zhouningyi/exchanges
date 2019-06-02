
const WebSocket = require('ws');
const url = require('url');
const _ = require('lodash');
const HttpsProxyAgent = require('https-proxy-agent');
const pako = require('pako');

const Event = require('bcore/event');

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
      data = pako.inflateRaw(data, { to: 'string' });
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

function checkError(l) {
  const { event, message } = l;
  if (event === 'error') {
    console.log(`【error】: ${message}`);
    process.exit();
  }
}

class WS extends Event {
  constructor(stream, o) {
    super();
    this.stream = stream;
    this.options = o;
    this._isReady = false;
    this.callbacks = [];
    this.sendSequence = {};
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
  restart() {
    this.init();
  }
  onLogin(cb) {
    this.onLoginCb = cb;
  }
  checkLogin(data) {
    if (data && data.event === 'login' && data.success) {
      if (this.onLoginCb) this.onLoginCb();
    }
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
      console.log(e, 'close');
      this._isReady = false;
      return this.restart();
    });
    ws.on('message', (data) => {
      try {
        data = processWsData(data);
        if (typeof data === 'string') data = JSON.parse(data);
        checkError(data);
        this.checkLogin(data);
        this._onCallback(data, ws);
      } catch (error) {
        console.log(`ws Parse json error: ${error.message}`);
        process.exit();
      }
      onceLoop(() => {
        ws.tryPing();
      }, loopInterval);
    });
  }
  send(msg) {
    if (!msg) return;
    if (!this.isReady()) setTimeout(() => this.send(msg), 100);
    // console.log(msg, 'msg');
    const { sendSequence } = this;
    const args = (sendSequence[msg.op] || []).concat(msg.args);
    _.set(sendSequence, msg.op, args);
    setTimeout(this._send.bind(this), 100);
  }
  _send() {
    const { sendSequence } = this;
    if (!_.values(sendSequence).length) return;
    _.forEach(sendSequence, (args, op) => {
      this.ws.send(JSON.stringify({ op, args }));
    });
    this.sendSequence = {};
  }
  _onCallback(ds) {
    const { callbacks } = this;
    let bol = true;
    _.forEach(callbacks, (cb) => {
      if (!bol) return;
      bol = bol && !cb(ds);
    });
  }
  genCallback(validate, cb) {
    const validateF = typeof validate === 'function' ? validate : d => d.table === validate;
    return (ds) => {
      if (validateF && validateF(ds)) return cb(ds);
      return false;
    };
  }
  onData(validate, cb) {
    cb = this.genCallback(validate, cb);
    this.callbacks.push(cb);
  }
}

function genWs(stream, o = {}) {
  return new WS(stream, o);
}

function genSubscribe(stream) {
  return (endpoint, cb, o = {}) => {
    let isable = true;
    //
    const { proxy, willLink, pingInterval, reconnect } = o;
    const options = proxy ? {
      agent: new HttpsProxyAgent(url.parse(proxy))
    } : {};
    //
    let ws;
    try {
      ws = new WebSocket(stream + endpoint, options);
    } catch (e) {
      console.log(e);
      restart();
    }

    function restart() {
      if (reconnect) reconnect();
      isable = false;
    }
    //
    ws.tryPing = (noop) => {
      try {
        ws.ping(noop);
      } catch (e) {
        console.log(e, 'ping error');
      }
    };
    //
    if (endpoint) ws.endpoint = endpoint;
    ws.isAlive = false;
    ws.on('open', () => {
      console.log('open');
      if (willLink) willLink(ws);
      if (pingInterval) loop(() => ws.tryPing(noop), pingInterval);
    });
    ws.on('pong', () => {
      // console.log('pong');
    });
    ws.on('ping', () => {
      // console.log('ping');
    });
    ws.on('error', (e) => {
      console.log(e, 'error');
      restart();
    });
    ws.on('close', (e) => {
      console.log(e, 'close');
      restart();
    });
    ws.on('message', (data) => {
      try {
        if (typeof data === 'string') data = JSON.parse(data);
        cb(data, ws);
      } catch (error) {
        console.log(`ws Parse json error: ${error.message}`);
      }
      onceLoop(() => {
        ws.tryPing();
      }, loopInterval);
    });
    return ws;
  };
}

module.exports = {
  genSubscribe,
  genWs,
};
