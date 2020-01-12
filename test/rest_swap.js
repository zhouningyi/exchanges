const { testRest, live } = require('./utils');

const exchanges = ['okexV3'];// , 'okex'. 'hitbtc', 'bittrex'`huobi
const tasks = [
  // {
  //   fn: 'swapOrder',
  //   params: {
  //     pair: 'ETH-USD',
  //     direction: 'UP',
  //     order_type: 'MAKER',
  //     amount: 1,
  //     price: 100,
  //     side: 'BUY',
  //     type: 'LIMIT'
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'batchCancelSwapOrders',
  //   params: {
  //     pair: 'ETH-USD',
  //     order_id: ['380000166782906368']
  //   },
  //   name: '撤销所有的订单'
  // },
  // {
  //   fn: 'swapOrderInfo',
  //   params: {
  //     pair: 'ETH-USD',
  //     order_id: '380015638598070272',
  //     side: 'BUY'
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'swapPosition',
  //   params: {
  //     pair: 'BTC-USD'
  //   },
  //   name: '仓位'
  // },
  // {
  //   fn: 'swapPositions',
  //   params: {
  //     pair: null
  //   },
  //   name: '永续仓位'
  // },
  // {
  //   fn: 'swapBalance',
  //   params: {
  //     coin: 'ETH'
  //   },
  //   name: '永续资金'
  // },
  // {
  //   fn: 'swapBalances',
  //   params: {
  //   },
  //   name: '永续资金'
  // },
  // {
  //   fn: 'swapOrders',
  //   params: {
  //     pair: 'ETH-USD',
  //     status: 'SUCCESS'
  //   },
  //   name: '所有swap订单'
  // },
  // {
  //   fn: 'unfinishSwapOrders',
  //   params: {
  //     pair: 'ETH-USD',
  //   }
  // },
  // {
  //   fn: 'getSwapConfig',
  //   params: {
  //     pair: 'ETH-USD',
  //   }
  // },
  // {
  //   fn: 'setSwapLeverate',
  //   params: {
  //     pair: 'ETH-USD',
  //     lever_rate: 11,
  //   }
  // },
];

testRest(exchanges, tasks);
live();
