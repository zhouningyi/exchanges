
const request = require('request');

function requestPromise (o){
  return new Promise((resolve, reject) => {
    request(o, (e, res, body) => {
      if (e) return reject(e);
      if (typeof body === 'string') body = JSON.parse(body);
      resolve(body);
    });
  });
}

module.exports = requestPromise;