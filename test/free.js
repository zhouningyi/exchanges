
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
    const { locked_balance, balance, coin } = bls;
    if (locked_balance) console.log(`${coin}资金被锁定${locked_balance}...`);
    bls.total_balance = locked_balance + balance;
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

function diff(balances1, balances2, pair, side, price) { // lastPrice
  const { source, target } = getCoinTS(pair, side);
  const dSource = balances2[source].total_balance - balances1[source].total_balance;
  const dTarget = balances2[target].total_balance - balances1[target].total_balance;

  // console.log(free, 'free', dTargetBySource, 'dTargetBySource');
  // const dBNB = balances2.BNB - balances1.BNB;// 币安的规则
  // const tradePrice = -dSource /  / dTarget * ;
  const free = side === 'BUY' ? price : 1 / price;
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

async function test(exName, pair, side = 'BUY', amount = 0.001) {
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
  const ratio = 0.1 / 1000;
  let price;
  if (side === 'BUY') {
    price = tick.ask_price * (1 + ratio);
  } else {
    price = tick.bid_price * (1 - ratio);
  }
  console.log('计划价格', price);
  //
  const orderO = { price, amount, pair, side, type: 'LIMIT' };
  const info = await ex.order(orderO);
  const { order_id } = info;
  // 交易
  const orderInfo = await ex.orderInfo({ order_id, pair });
  console.log(orderInfo, 'orderInfo');
  if (orderInfo) {
    const { status } = orderInfo;
    if (status === 'SUCCESS') {
      price = orderInfo.price;
      console.log('实际价格', price);
    } else {
      print('开始取消交易...');
      await ex.cancelAllOrders({
        pair
      });
      print('已取消交易...');
      process.exit();
    }
  }
  //
  print('交易后账户资金...');
  let balanceAfter = await ex.balances();
  balanceAfter = getRefBalance(balanceAfter, pair);


  //
  diff(balanceBefore, balanceAfter, pair, side, price);
  print('取消未成交的资金...');
  // await ex.cancelAllOrders();

  //
  // let balanceFinal = await ex.balances();
  // balanceFinal = getRefBalance(balanceFinal, pair);
  // diff(balanceAfter, balanceFinal, pair, side, price);
}

test('okex', 'BTC-USDT', 'BUY', 0.002);
