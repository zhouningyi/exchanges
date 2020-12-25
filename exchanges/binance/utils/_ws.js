
const WebSocket = require('ws');
const _ = require('lodash');
const Event = require('bcore/event');
const Utils = require('../../../utils');
const { upperFirst } = require('lodash');

const { delay, checkKey, cleanObjectNull } = Utils;

function noop() {}

const loopInterval = 4000;

function processWsData(data) {
  if (typeof (data) === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.log(e, 'String parse json error');
    }
    return data;
  }
  return data;
}

function loop(fn, time) {
  fn();
  setTimeout(() => loop(fn, time), time);
}
const onceLoop = _.once(loop);

function checkError(l) {
  const { event, error } = l;
  if (error) {
    console.log(`【error】: ${error.msg || error}`);
    process.exit();
  }
}

class WS extends Event {
  constructor(that, o) {
    super();
    this.that = that;
    this.options = o;
    this.streams = {};
    this.listenKeys = {};
    this.idIndex = 1;
    this.funcIdMap = {};
    this.idFuncMap = {};
    this.callbacks = {};
    this._isReady = false;
    this.updateListenKeys();
  }
  loadConfigs(os) {
    _.forEach(os, (o, name) => this.loadConfig(o, name));
  }
  loadConfig(o) {
    this.that[o.name] = this.createFunction(o);
  }
  createFuncId() {
    this.idIndex += 1;
    return this.idIndex;
  }
  async _getListenKey({ baseType }) {
    let listenKey = this.listenKeys[baseType];
    if (!listenKey) {
      const listenKeyO = await this.createListenKey(baseType);
      listenKey = listenKeyO ? listenKeyO.listenKey : '';
      if (listenKey) this.listenKeys[baseType] = listenKey;
    }
    return listenKey;
  }
  async updateListenKeys() {
    const { listenKeys } = this;
    const baseTypes = ['spot', 'coinContract'];
    for (const baseType of baseTypes) {
      try {
        const listenKey = listenKeys[baseType];
        if (listenKey) await this.that[`update${upperFirst(baseType)}ListenKey`]({ listenKey });
      } catch (e) {
        console.log(e, '_ws/updateListenKeys error..');
      }
    }
    await delay(60 * 1000);
    await this.updateListenKeys();
  }
  async createListenKey(baseType) {
    if (baseType === 'coinContract') return await this.that.coinContractListenKey();
    if (baseType === 'spot') return await this.that.spotListenKey();
    console.log(`createListenKey 不能识别的baseType:${baseType}....`);
  }
  async getMessage(opt, o) {
    const { streamName, method } = o;
    const params = (typeof (streamName) === 'function') ? streamName(opt) : Array.isArray(streamName) ? streamName : [streamName];
    const id = this.idFuncMap[o.name] || this.createFuncId();
    this.idFuncMap[id] = o.name;
    this.funcIdMap[o.name] = id;
    return { method, params, id };
  }
  _formatLine(line) {
    line = cleanObjectNull(line);
    line.api_key = this.that.getApiKey();
    line.exchange = this.that.name.toUpperCase();
    return line;
  }
  _formatResult(data) {
    if (Array.isArray(data)) return _.map(data, d => this._formatLine(d));// cleanObjectNull(data);
    if (data) return this._formatLine(data);
  }
  createFunction(o = {}) {
    let { streamName, base, method } = o;
    if (streamName !== 'listenKey') {
      const connectionId = base;
      const connectionUrl = base;
      if (!this[connectionId]) this.createConnection({ connectionId, connectionUrl });
      return async (opt, cb) => {
        if (streamName && streamName.startsWith && streamName.startsWith('listenKey')) {
          const listenKey = await this._getListenKey(o);
          streamName = streamName.replace('listenKey', listenKey);
        }
        const mesagage = await this.getMessage(opt, { ...o, streamName, method });
        this.send(connectionId, mesagage);
        return new Promise((resolve, reject) => {
          let timeoutId;
          if (!cb) {
            timeoutId = setTimeout(() => {
              console.log(`${o.name}, ${streamName}: timeout...`);
              console.log(mesagage, '.mesagagemesagage....');
              process.exit();
              reject(`_ws: ${streamName} no return...`);
            }, 5 * 1000);
          }
          this.registerFunc(connectionId, o.name, async (data) => {
            if (o.chanel) {
              const channelF = typeof (o.chanel) === 'function' ? o.chanel : d => d.e === o.chanel;
              if (channelF(data)) {
                data = o.formater(data, opt);
                data = this._formatResult(data);
                if (cb) cb(data);
                resolve(data);
                clearTimeout(timeoutId);
              }
            }
          }, 1);
        });
      };
    } else {
      return async (opt, cb) => {
        const streamName = await this._getListenKey(o);
        const connectionId = `${base}_account`;
        const co = { connectionId, connectionUrl: `${o.base}/${streamName}` };
        if (o.baseType === 'spot') {
          co.connectionUrl = `${o.base}?streams=${streamName}`;
        }
        if (!this[connectionId]) this.createConnection(co);
        this.registerFunc(connectionId, o.name, async (data) => {
          if (o.chanel) {
            const channelF = typeof (o.chanel) === 'function' ? o.chanel : d => d.e === o.chanel;
            if (channelF(data)) {
              data = o.formater(data, opt);
              data = this.that.wrapperInfo(data);
              data = this._formatResult(data);
              cb(data);
            }
          }
        }, 2);
      };
    }
  }
  registerFunc(name, streamName, fn, idx) {
    const cbs = this.callbacks[name] = this.callbacks[name] || {};
    cbs[streamName] = fn;
  }
  async send(connectionId, message) {
    const ws = this[connectionId];
    if (!ws || !ws._isReady) {
      await delay(100);
      return await this.send(connectionId, message);
    }
    ws.send(JSON.stringify(message));
  }
  createConnection(o) {
    const { connectionId, connectionUrl } = o;
    const options = {};
    try {
      const ws = this[connectionId] = new WebSocket(connectionUrl, options);
      this.addWsHooks(ws, o);
      return ws;
    } catch (e) {
      console.log(e, '建立ws出错 重启中...');
      return this.createConnection(o);
    }
  }
  addWsHooks(ws, o = {}) {
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
      ws._isReady = true;
      if (pingInterval) loop(() => ws.tryPing(noop), pingInterval);
    });
    ws.on('pong', (e) => {
      // console.log('pong');
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
      ws._isReady = false;
      return this.restart();
    });
    ws.on('close', (e, b) => {
      console.log(e, b, o, 'close');
      this._isReady = false;
      return this.restart();
    });
    ws.on('message', (data) => {
      this._onCallback(data, o);
      onceLoop(() => {
        ws.tryPing();
      }, loopInterval);
    });
  }
  restart() {
    console.log('ws restart... 111111111111111111');
    process.exit();
  }
  _onCallback(data, { connectionId }) {
    try {
      data = processWsData(data);
      checkError(data);
    } catch (error) {
      console.log(`ws Parse raw message error: ${error.message}`);
      process.exit();
    }
    // if (
    //           !(data && data.stream && data.stream.indexOf('depth') !== -1) &&
    //           !(data && data.e && data.e === 'depthUpdate')
    //           ) {
    //   console.log(data, connectionId, 'data....');
    //   if (data.result) {
    //             // console.log(data.result[0], 99999);
    //   }
    // }
    const cbs = this.callbacks[connectionId];
    _.forEach(_.values(cbs), cb => cb(data));
  }
}

function genWs(stream, o = {}) {
  return new WS(stream, o);
}

module.exports = {
  genWs,
};
