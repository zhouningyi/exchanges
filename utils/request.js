
const request = require('request');

const Utils = require('./../utils');

function requestPromise(o) {
  const t = new Date();
  return new Promise((resolve, reject) => {
    request(o, (e, res, body) => {
      Utils.print(`${new Date() - t}ms...`, 'yellow');
      if (e) return reject(e);
      if (typeof body === 'string') body = JSON.parse(body);
      resolve(body);
    });
  });
}

module.exports = requestPromise;
