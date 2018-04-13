
const _ = require('lodash');
//
const config = require('./../config');
const Exchanges = require('./../index');

function getAppKey(name) {
  const keyName = `${name}Zhou`;
  return config[keyName];
}

async function extrude(ex, exName, d) {
  function print(ds, str) {
    const space = '========';
    console.log(JSON.stringify(ds, null, 2));
    ds = (ds && typeof ds === 'object') ? JSON.stringify(ds, null, 2).substring(0, 400) : '无返回...';
    console.log('数组长度:', ds.length, `${space}${exName}.${str}${space}`);
  }
  const fn = ex[d.fn];
  if (!fn) {
    print(d.fn, '无法找到...');
    return;
  }
  const ds = await fn.bind(ex)(d.params);
  print(ds, d.name);
}


function upperFirst(d) {
  const str = d[0].toUpperCase();
  return str + d.substring(1);
}

function getExchange(name) {
  const conf = getAppKey(name);
  name = upperFirst(name);
  const Exchange = Exchanges[name];
  return new Exchange(conf);
}

module.exports = {
  extrude, getAppKey, upperFirst, getExchange
};
