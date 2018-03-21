
const Exchanges = require('./../index');

const config = require('./../config');

const exName = 'Binance';
const keyName = 'binanceZhou';
const Exchange = Exchanges[exName];

const ex = new Exchange(config[keyName]);

const space = '========';
function print(ds, str) {
  console.log(ds, `${space}${str}${space}`);
}
async function depth() {
  const ds = await ex.depth({ pair: 'ETH-BTC' });
  print(ds, '深度');
  return ds;
}

async function balances() {
  const ds = await ex.balances();
  print(ds, '账户余额');
  return ds;
}

async function ticks() {
  const ds = await ex.ticks();
  print(ds, 'ticks数据');
  return ds;
}

async function test() {
  await depth();
  await balances();
  await ticks();
}

test();
