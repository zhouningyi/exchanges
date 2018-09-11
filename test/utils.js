
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
    const space = '------';
    let dstr = '';
    if (ds) {
      dstr = `数组长度: ${ds.length}`;
      console.log(JSON.stringify(ds, null, 2), 'res');
      ds = (typeof ds === 'object') ? JSON.stringify(ds, null, 2).substring(0, 400) : '无返回...';
    }
    console.log(dstr, `${space}${exName}.${str}${space}`);
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
}

async function testOneExchange(exName, tasks) {
  const ex = getExchange(exName);
  console.log(`测试交易所【${exName}】...`);
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    console.log(`测试任务${i}: ${task.fn}(${task.name})`);
    await extrude(ex, exName, task);
  }
}

async function testRest(exNames, tasks) {
  for (let i = 0; i < exNames.length; i++) {
    const exName = exNames[i];
    await testOneExchange(exName, tasks);
  }
}


module.exports = {
  extrude, getAppKey, upperFirst, getExchange, validate, testRest
};
