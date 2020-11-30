
const request = require('request');
const got = require('got');
const Utils = require('./../utils');
const { fcoin } = require('../config');
const argv = require('optimist').argv;

const logrest = !!argv.logrest;

// async function test() {
//   const response = await got('https://baidu.com');
//   console.log(response.body);
// }

// test();

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


const TIME_OUT = 8 * 1000;
async function requestGot(o) {
  let { uri, url, method = 'GET', headers = {} } = o;

  const dataO = {};
  if (o.form) {
    dataO.form = o.form;
    headers['content-type'] = headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  if (o.qs) {
    if (o.method === 'PUT') {
      // dataO.body = JSON.stringify(o.qs);
      // // headers['content-type'] = headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      dataO.json = o.qs;
    }
  }
  if (o.body) {
    dataO.body = o.body;
  }

  method = method.toUpperCase();
  url = uri || url;
  let res;
  //
  headers['content-type'] = headers['Content-Type'];
  const defaultO = { headers: { ...headers }, dnsCache: true, resolveBodyOnly: true, http2: false, timeout: TIME_OUT, responseType: 'json' };
  let opt;
  try {
    if (method === 'GET') {
      opt = { ...defaultO };
      // console.log(opt, 'GET start......');
      res = await got(url, opt);
    } else if (method === 'POST') {
      opt = { ...defaultO, ...dataO };
      res = await got.post(url, opt);
    } else if (method === 'DELETE') {
      opt = { ...defaultO, ...dataO };
      res = await got.delete(url, opt);
    } else if (method === 'PUT') {
      opt = { ...defaultO, ...dataO };
      res = await got.put(url, opt);
    } else {
      console.log(method, 'METHOD..ERROR.............');
    }
  } catch (e) {
    console.log(e, o, 'request query_error...');
    return null;
  }
  if (!res) console.log(o, opt, 'requestP/no data...');
  return res || null;
}

function requestPromise(o) {
  const t = new Date();
  return new Promise((resolve, reject) => {
    if (!o.timeout) o.timeout = TIME_OUT;
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
        console.log(e, 'e....');
        reject();
      }
    });
  });
}

async function requestMix(o) {
  if (['GET', 'POST'].includes(o.method)) {
    return await requestGot(o);
  }
  return await requestPromise(o);
}

module.exports = requestPromise;
