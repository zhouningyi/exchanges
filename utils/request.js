
const request = require('request');

function requestPromise (o){
  const t = new Date();
  return new Promise((resolve, reject) => {
    request(o, (e, res, body) => {
      console.log(`${new Date() - t}ms...`);
      if (e) return reject(e);
      if (typeof body === 'string') body = JSON.parse(body);
      resolve(body);
    });
  });
}

module.exports = requestPromise;