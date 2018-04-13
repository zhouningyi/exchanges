import { utimes } from 'fs';

const _ = require('lodash');
//
const Exchanges = require('./../index');
const config = require('./../config');
const { extrude, getExchange, upperFirst } = require('./utils');


const spotExchangeList = ['bittrex'];// , 'okex'. 'hitbtc'
const spotTasks = [
  // {
  //   fn: 'order',
  //   params: {
  //     pair: 'BTC-USDT',
  //     amount: 0.0012,
  //     price: 7155,
  //     side: 'BUY',
  //     type: 'MARKET'
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'fastOrder',
  //   params: {
  //     pair: 'ETH-BTC',
  //     amount: 0.02,
  //     price: 0.05,
  //     side: 'BUY',
  //     type: 'LIMIT'
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'cancelAllOrders',
  //   params: {},
  //   name: '取消正在执行中的订单'
  // },
  // {
  //   fn: 'activeOrders',
  //   params: {},
  //   name: '正在执行中的订单'
  // },
  // {
  //   fn: 'orderInfo',
  //   params: {
  //     pair: 'ETH-BTC',
  //     orderId: '5ab781719dda152895660f43',
  //     side: 'BUY'
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'cancelOrder',
  //   params: {
  //     pair: 'ETH-BTC',
  //     side: 'BUY',
  //     orderId: '5ab781719dda152895660f43'
  //   },
  //   name: '取消交易'
  // },
  {
    fn: 'pairs',
    params: {},
    name: '交易对信息'
  },
  // {
  //   fn: 'coins',
  //   params: {},
  //   name: '币信息'
  // },
  {
    fn: 'ticks',
    params: { pair: 'ETH-BTC' },
    name: 'ticks数据'
  },
  // {
  //   fn: 'balances',
  //   params: {},
  //   name: '账户余额'
  // },
//{
//   fn: 'depth',
//   params: { pair: 'ETH-BTC' },
//   name: '深度'
// }, {
//   fn: 'orderBook',
//   params: { pair: 'ETH-BTC' },
//   name: 'orderBook数据'
// }
];

const futureList = ['okex'];
const futureTasks = [
//   {
//   fn: 'futureTick',
//   params: { pair: 'ETH-BTC', contract_type: 'this_week' },
//   name: '期货ticks数据'
// },
  // {
  //   fn: 'futureDepth',
  //   params: { pair: 'ETH-BTC', contract_type: 'this_week' },
  //   name: '期货深度数据'
  // },
  {
    fn: 'futureOrderBook',
    params: { pair: 'ETH-BTC', contract_type: 'this_week' },
    name: '期货订单数据'
  },
];


async function testOneExchange(exName, tasks) {
  const ex = getExchange(exName);
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    console.log(`测试第【${i}】个任务 ${task.fn}(${task.name})`);
    await extrude(ex, exName, task);
  }
}

async function test(exNames, tasks) {
  for (let i = 0; i < exNames.length; i++) {
    const exName = exNames[i];
    console.log(`测试交易所${exName}...`);
    await testOneExchange(exName, tasks);
  }
}

test(spotExchangeList, spotTasks);
// test(futureList, futureTasks);
