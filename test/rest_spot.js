const { testRest } = require('./utils');

const exchanges = ['okex'];
// , 'okex'. 'hitbtc' 'bittrex'， fcoin

const tasks = [
  // {
  //   fn: 'time',
  //   params: {},
  //   name: '服务器时间'
  // },
  // {
  //   fn: 'order',
  //   params: {
  //     pair: 'IOTA-BTC',
  //     amount: 1,
  //     price: 0.0001,
  //     side: 'BUY',
  //     type: 'LIMIT'
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'orders',
  //   params: {
  //     pair: 'FT-ETH',
  //     status: 'FINISH'
  //   },
  //   name: '所有的订单'
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
  //   params: {
  //     pair: 'FT-ETH'
  //   },
  //   name: '取消正在执行中的订单'
  // },
  // {
  //   fn: 'activeOrders',
  //   params: {
  //     pair: 'OKB-USDT'
  //   },
  //   name: '正在执行中的订单'
  // },
  // {
  //   fn: 'finishOrders',
  //   params: {
  //     pair: 'OKB-USDT'
  //   },
  //   name: '已经完成的订单'
  // },
  // {
  //   fn: 'orderInfo',
  //   params: {
  //     pair: 'OKB-BTC',
  //     order_id: '11931810',
  //     side: 'SELL'
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'cancelOrder',
  //   params: {
  //     order_id: '101102451',
  //     pair: 'IOTA-BTC'
  //   },
  //   name: '取消交易'
  // },
  // {
  //   fn: 'pairs',
  //   params: {},
  //   name: '交易对信息'
  // },
  // {
  //   fn: 'coins',
  //   params: {},
  //   name: '币信息'
  // },
  // {
  //   fn: 'tick',
  //   params: { pair: 'ETH-USDT' },
  //   name: 'tick数据'
  // },
  // {
  //   fn: 'ticks',
  //   params: { pair: 'OKB-USDT' },
  //   name: 'ticks数据'
  // },

  // {
  //   fn: 'accounts',
  //   params: {},
  //   name: 'accounts'
  // },
  // {
  //   fn: 'balances',
  //   params: {
  //   },
  //   name: '账户余额'
  // },
  // {
  //   fn: 'futureBalances',
  //   params: {},
  //   name: '合约(全仓)余额'
  // },
  // {
  //   fn: 'depth',
  //   params: { pair: 'ETH-BTC' },
  //   name: '深度'
  // },

  // {
  //   fn: 'kline',
  //   params: { pair: 'ETH-BTC', interval: '1m' },
  //   name: 'orderBook数据'
  // },
// / {
//   fn: 'orderBook',
//   params: { pair: 'ETH-BTC' },
//   name: 'orderBook数据'
// },
  // {
  //   fn: 'unfinishedOrderInfo',
  //   params: { pair: 'OKB-USDT' },
  //   name: 'orderBook未成交的订单'
  // },

];


testRest(exchanges, tasks);
