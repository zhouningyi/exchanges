
const request = require('request');
const got = require('got');
const Utils = require('./../utils');
const argv = require('optimist').argv;

const logrest = !!argv.logrest;

// {
//   uri: 'https://www.okex.com/api/futures/v3/orders/ETH-USD-200515?instrument_id=ETH-USD-200515&state=6',
//   proxy: null,
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//     'User-Agent': 'Mozilla/4.0 (compatible; Node OKEX API)',
//     'OK-ACCESS-KEY': '1e3209bb-a5f4-4906-b9e2-1769dc39bf6e',
//     'OK-ACCESS-SIGN': 'nnDEFZPMHj5CaYayp0g4vTwqRvdrYTa9XxO6kkR8Auk=',
//     'OK-ACCESS-TIMESTAMP': '2020-05-03T10:25:22.394Z',
//     'OK-ACCESS-PASSPHRASE': 'zhouningyi1'
//   }
// }


async function requestP(o) {
  let { uri, url, method = 'GET', headers = {} } = o;
  if (method === 'POST') {
    console.log(o);
    process.exit();
  }

  method = method.toUpperCase();
  url = uri || url;
  let res;
  //
  headers['content-type'] = headers['Content-Type'];
  const defaultO = { headers: { ...headers }, resolveBodyOnly: true, http2: true, responseType: 'json' };
  let opt;
  try {
    if (method === 'GET') {
      opt = { ...defaultO };
      res = await got(url, opt);
    } else if (method === 'POST') {
      // console.log(9999999999999999999999999);
      res = await got.post(url, { ...defaultO, body: 'json' });
    } else {
      console.log('METHOD..ERROR.............');
    }
  } catch (e) {
    console.log(e, opt, 999999999);
  }

  return res ? res.body : null;
}


function requestPromise(o) {
  // console.log(o, '===>>>');
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
