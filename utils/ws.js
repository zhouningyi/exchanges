
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
      data = JSON.parse(data);
      return data;
    } catch (e) {
      console.log(e, 'pako parse error');
    }
  }
  return false;
}

function loop(fn, time) {
  fn();
  setTimeout(() => loop(fn, time), time);
}
const onceLoop = _.once(loop);

class WS extends Event {
  constructor(stream, o) {
    super();
    this.stream = stream;
    this.options = o;
    this._isReady = false;
    this.callbacks = [];
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
    ws.on('open', () => {
      console.log('ws open...');
      this._isReady = true;
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
      this._isReady = false;
      process.exit();
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
        // if (typeof data === 'string') data = JSON.parse(data);
        this._onCallback(data, ws);
      } catch (error) {
        console.log(`ws Parse json error: ${error.message}`);
      }
      onceLoop(() => {
        ws.tryPing();
      }, loopInterval);
    });
  }
  query() {
  }
  send(msg) {
    if (!msg) return;
    if (!this.isReady()) setTimeout(() => this.send(msg), 100);
    if (typeof msg === 'object') msg = JSON.stringify(msg);
    console.log(msg, 'msg');
    this.ws.send(msg);
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
    return (ds) => {
      if (validate(ds)) return true && cb(ds);
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
      console.log(stream + endpoint);
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
        console.log(data);
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
  genWs
};
