
const _ = require('lodash');
//

const config = require('./../config');
const { getExchange } = require('./utils');
const Utils = require('./../utils');

// 关于交易费用的测试
function filterBalance(balances, arr) {
  arr = _.keyBy(arr, d => d);
  return _.filter(balances, balance => balance.coin in arr);
}

function getRefCoins(PAIR) {
  return PAIR.split('-').concat(['BNB']);
}

function getRefBalance(balance, PAIR) {
  const coins = getRefCoins(PAIR);
  balance = filterBalance(balance, coins);
  const result = {};
  _.forEach(balance, (bls) => {
    const { lockedBalance, balance, coin } = bls;
    if (lockedBalance) console.log(`${coin}资金被锁定${lockedBalance}...`);
    bls.totalBalance = lockedBalance + balance;
    result[coin] = bls;
  });
  return result;
}

// 获取target和source的对象
function getCoinTS(pair, side) {
  const pairs = pair.split('-');
  if (side === 'BUY') {
    return {
      source: pairs[1],
      target: pairs[0]
    };
  } else if (side === 'SELL') {
    return {
      source: pairs[0],
      target: pairs[1]
    };
  } else {
    console.log('side有误...');
    process.exit();
  }
}

async function delay(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout);
  });
}

function print(str, color = 'gray') {
  Utils.print(str, color);
}


function diff(balances1, balances2, pair, side, price, lastPrice) {
  const { source, target } = getCoinTS(pair, side);
  const dSource = balances2[source].totalBalance - balances1[source].totalBalance;
  const dTarget = balances2[target].totalBalance - balances1[target].totalBalance;

  // console.log(free, 'free', dTargetBySource, 'dTargetBySource');
  // const dBNB = balances2.BNB - balances1.BNB;// 币安的规则
  const tradePrice = -dSource / dTarget;
  console.log(price, lastPrice, tradePrice, 'price, lastPrice, tradePrice');
  const free = side === 'BUY' ? tradePrice : 1 / tradePrice;
  const dTargetBySource = dTarget * free;
  if (!dTarget) return;
  let tradeFree = (dSource + dTargetBySource) / dSource;
  tradeFree = (tradeFree * 1000).toFixed(3);
  print(`
  ${target}: ${dTarget}
  ${source}: ${dSource}
  free: 千分之${tradeFree}
`, 'green');
}

async function test(exName, pair, side = 'BUY') {
  const ex = getExchange(exName);
  //
  // if (ex.wsBalance) {
  //   ex.wsBalance({}, (ds) => {
  //     console.log(ds);
  //   });
  // }
  // await delay(10000);

  print('交易前账户资金...');
  let balanceBefore = await ex.balances();
  balanceBefore = getRefBalance(balanceBefore, pair);
  // console.log(balanceBefore, 'balanceBefore');
  //
  print('交易价格...');
  const tick = await ex.ticks({ pair });
  //
  print('开始交易...');
  const price = tick.ask_price * (1 + 0.4 / 1000);
  const amount = 0.00101;
  const orderO = { price, amount, pair, side, type: 'LIMIT' };
  await ex.order(orderO);

  //
  print('交易后账户资金...');
  let balanceAfter = await ex.balances();
  balanceAfter = getRefBalance(balanceAfter, pair);

  //
  diff(balanceBefore, balanceAfter, pair, side, price, tick.last_price);
  print('取消未成交的资金...');
  await ex.cancelAllOrders();

  //
  // let balanceFinal = await ex.balances();
  // balanceFinal = getRefBalance(balanceFinal, pair);
  // diff(balanceAfter, balanceFinal, pair, side, price);
}

test('binance', 'ETH-BTC');
