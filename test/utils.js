
const _ = require('lodash');
const Utils = require('./../utils');
//
const { baseFnsConfig } = require('./../utils/fn');
const config = require('./../config');
const Exchanges = require('./../index');

function getAppKey(name) {
  const keyName = `${name}`;
  return config[keyName];
}

async function extrude(ex, exName, d) {
  function print(ds, str) {
    const space = '------';
    let dstr = '';
    if (ds) {
      dstr = `数组长度: ${ds.length}`;
      Utils.print(JSON.stringify(ds, null, 2), 'green');
      ds = (typeof ds === 'object') ? JSON.stringify(ds, null, 2).substring(0, 400) : '无返回...';
    }
    console.log(dstr, `${space}${exName}.${d.fn}(${str})${space}`);
  }
  const fn = ex[d.fn];
  if (!fn) {
    print(null, `${d.fn}无法找到...`);
    return;
  }
  const ds = await fn.bind(ex)(d.params);
  print(ds, d.name);
}

function upperFirst(d) {
  const str = d[0].toUpperCase();
  return str + d.substring(1);
}

function checkExchangeFns(exchange) {
  _.forEach(baseFnsConfig, (o) => {
    const { name } = o;
    const fn = exchange[name];
    if (!fn) return Utils.print(`交易所${exchange.name}: 缺失函数${name}`, 'gray');
  });
}

function getExchange(name) {
  const conf = getAppKey(name);
  name = upperFirst(name);
  const Exchange = Exchanges[name];
  const ex = new Exchange(conf);
  validate(ex);
  return ex;
}

function validate(ex) {
  if (!ex.name) console.log('exchange对象必须有name');
  checkExchangeFns(ex);
}

async function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
async function testOneExchange(exName, tasks) {
  const ex = getExchange(exName);
  await delay(500);
  console.log(`测试交易所【${exName}】...`);
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const { name } = task;
    const ext = name ? `(${name})` : '';
    Utils.print(`测试: ${task.fn}${ext}(opt)`, 'yellow');
    await extrude(ex, exName, task);
  }
}

async function testRest(exNames, tasks) {
  for (let i = 0; i < exNames.length; i++) {
    const exName = exNames[i];
    await testOneExchange(exName, tasks);
  }
}

function live() {
  setTimeout(() => null, 1000000);
}

module.exports = {
  extrude, getAppKey, upperFirst, getExchange, validate, testRest, live
};
