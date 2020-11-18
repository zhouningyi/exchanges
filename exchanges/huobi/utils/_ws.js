
const WebSocket = require('ws');
const url = require('url');
const _ = require('lodash');
const pako = require('pako');

const Event = require('bcore/event');

function noop() {}

const loopInterval = 4000;

function processWsData(data) {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.log(e, 'String parse json error');
    }
    return data;
  } else {
    try {
      data = pako.inflate(data, {
        to: 'string'
      });
      return JSON.parse(data);
    } catch (e) {
      console.log(e, data, 'pako parse error...');
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
    const options = {};
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
    if (data && data.op === 'auth' && !data['err-code']) {
      if (this.onLoginCb) this.onLoginCb();
    }
  }
  checkPing(line) {
    if (!line) return;
    if (line.ping) {
      const msg = { pong: line.ping };
      this.send(msg);
    } else if (line.op === 'ping') {
      const msg = { op: 'pong', ts: line.ts };
      this.send(msg);
    }
  }
  onOpen(cb) {
    this._onOpen = cb;
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
      if (this._onOpen) this._onOpen();
      if (pingInterval) loop(() => ws.tryPing(noop), pingInterval);
    });
    ws.on('pong', (e) => {
      // const data = processWsData(e);
      // console.log(e, 'pong');
    });
    ws.on('ping', (e) => {
      console.log('ping', e.toString());
    });
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
    ws.on('message', (_data) => {
      let data;
      try {
        data = processWsData(_data);
        if (typeof data === 'string') data = JSON.parse(data);
      } catch (error) {
        console.log(`ws Parse json error: ${error.message}`, _data, data);
        // process.exit();
      }
      try {
        checkError(data);
        this.checkLogin(data);
      } catch (e) {
        console.log(e, 1);
      }
      try {
        this.checkPing(data);
        this._onCallback(data, ws);
      } catch (e) {
        console.log(e, 2);
      }
      onceLoop(() => {
        ws.tryPing();
      }, loopInterval);
    });
  }
  send(msg) {
    if (!msg) return;
    if (!this.isReady()) setTimeout(() => this.send(msg), 100);
    if (Array.isArray(msg)) {
      _.forEach(msg, m => this.send(m));
    } else {
      const text = JSON.stringify(msg);
      this.ws.send(text);
    }
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
      if (ds && ds.op === 'sub') return false;
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


module.exports = {
  genWs,
};
