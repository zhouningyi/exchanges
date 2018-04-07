
const WebSocket = require('ws');
const url = require('url');
const _ = require('lodash');
const HttpsProxyAgent = require('https-proxy-agent');

function loop(fn, time) {
  fn();
  setTimeout(loop, time);
}

function noop() {}

function genSubscribe(stream) {
  return (endpoint, callback, o = { }) => {
    const { proxy, willLink, pingInterval } = o;
    // if (options.verbose) options.log(`Subscribed to ${endpoint}`);
    const options = proxy ? {
      agent: new HttpsProxyAgent(url.parse(proxy))
    } : {};
    //
    const ws = new WebSocket(stream + endpoint, options);
    if (endpoint) ws.endpoint = endpoint;
    ws.isAlive = false;
    ws.on('open', () => {
      if (willLink) willLink(ws);
      if (pingInterval) loop(() => ws.ping(noop), pingInterval);
      // console.log(`${stream} open...`);
    });
    ws.on('pong', () => {
      // console.log(`${stream} pong...`);
    });
    ws.on('ping', () => {
      // console.log(`${stream} pong...`);
    });
    ws.on('error', e => console.log(e, 'error'));
    ws.on('close', e => console.log(e, 'close'));
    ws.on('message', (data) => {
      try {
        if (typeof data === 'string') data = JSON.parse(data);
        callback(data);
      } catch (error) {
        console.log(`Parse error: ${error.message}`);
      }
    });
    return ws;
  };
}

module.exports = {
  genSubscribe
};
