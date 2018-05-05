
const WebSocket = require('ws');
const url = require('url');
const _ = require('lodash');
const HttpsProxyAgent = require('https-proxy-agent');

function noop() {}

const loopInterval = 4000;
function genSubscribe(stream) {
  return (endpoint, cb, o = {}) => {
    let isable = true;
    function loop(fn, time) {
      fn();
      if (!isable) return;
      setTimeout(() => loop(fn, time), time);
    }
    const onceLoop = _.once(loop);
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
        cb(data);
      } catch (error) {
        console.log(`Parse error: ${error.message}`);
      }
      onceLoop(() => {
        ws.tryPing();
      }, loopInterval);
    });
    return ws;
  };
}

module.exports = {
  genSubscribe
};
