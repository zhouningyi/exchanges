
const request = require('request');
const Utils = require('./../utils');
const argv = require('optimist').argv;

const logrest = !!argv.logrest;

function requestPromise(o) {
  const t = new Date();
  return new Promise((resolve, reject) => {
    if (!o.timeout) o.timeout = 10000;
    request(o, (e, res, body) => {
      const url = `${o.method}: ${(o.uri || o.url).substring(0, 80)}...`;
      if (logrest) {
        Utils.print(`${new Date() - t}ms...${url}`, 'gray');
      }
      if (e) return reject(e);
      try {
        if (typeof body === 'string') {
          if (body === '') return reject();
          return resolve(JSON.parse(body));
        }
        reject();
      } catch (e) {
        Utils.print(url, 'red');
        console.log(body, o, 'body...');
        console.log(e);
        reject();
      }
    });
  });
}

module.exports = requestPromise;
