
const request = require('request');
const Utils = require('./../utils');
const argv = require('optimist').argv;

const logrest = !!argv.logrest;

function requestPromise(o) {
  const t = new Date();
  return new Promise((resolve, reject) => {
    request(o, (e, res, body) => {
      if (logrest) {
        const url = `${o.method}: ${(o.uri || o.url).substring(0, 80)}...`;
        Utils.print(`${new Date() - t}ms...${url}`, 'gray');
      }
      if (e) return reject(e);
      try {
        if (typeof body === 'string') body = JSON.parse(body);
        resolve(body);
      } catch (e) {
        console.log(e, body);
        reject();
      }
    });
  });
}

module.exports = requestPromise;
