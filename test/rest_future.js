const { testRest, live } = require('./utils');

const exchanges = ['okexV3'];// , 'okex'. 'hitbtc', 'bittrex'
const tasks = [
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
    //   fn: 'unfinishFutureOrders'
    // }
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
  //     order_id: '5ab781719dda152895660f43',
  //     side: 'BUY'
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'cancelOrder',
  //   params: {
  //     pair: 'ETH-BTC',
  //     side: 'BUY',
  //     order_id: '5ab781719dda152895660f43'
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
  //   fn: 'futureKline',
  //   params: { pair: 'ETH-USD' },
  //   name: '期货k线图'
  // },
  // {
  //   fn: 'ticks',
  //   params: { pair: 'ETH-BTC' },
  //   name: 'ticks数据'
  // },
  // {
  //   fn: 'balances',
  //   params: {},
  //   name: '账户余额'
  // },
// {
//   fn: 'depth',
//   params: { pair: 'ETH-BTC' },
//   name: '深度'
// }, {
//   fn: 'orderBook',
//   params: { pair: 'ETH-BTC' },
//   name: 'orderBook数据'
// },
// {
//   fn: 'moveBalance',
//   params: { source: 'future', target: 'spot', coin: 'BTC', amount: 0.0019 },
//   name: '移动资金'
// },
  // {
  //   fn: 'futureOrder',
  //   params: {
  //     pair: 'EOS-USDT',
  //     contract_type: 'quarter',
  //     lever_rate: 10,
  //     side: 'BUY',
  //     direction: 'up',
  //     amount: 1,
  //     type: 'LIMIT',
  //     price: 7.2,
  //   },
  //   name: '购买期货'
  // },
  // {
  //   fn: 'successFutureOrders',
  //   params: {
  //     pair: 'EOS-USDT',
  //     contract_type: 'quarter',
  //     status: 'SUCCESS'
  //   },
  //   name: '所有期货订单'
  // },
  {
    fn: 'futureOrder',
    params: {
      client_oid: 'xx',
      pair: 'ETH-USDT',
      contract_type: 'quarter',
      lever_rate: 10,
      side: 'BUY',
      direction: 'up',
      amount: 1,
      type: 'LIMIT',
      price: 100,
    },
    name: '购买期货'
  },
  // {
  //   fn: 'futureOrderInfo',
  //   params: {
  //     order_id: '596402338479104',
  //     contract_type: 'quarter',
  //     pair: 'BTC-USDT',
  //   },
  //   name: '期货订单查询'
  // },
  // {
  //   fn: 'cancelAllFutureOrders',
  //   params: {
  //   },
  //   name: '撤销所有的订单'
  // },
  // {
  //   fn: 'futureAllOrders',
  //   params: {
  //     contract_type: 'quarter',
  //     pair: 'BTC-USDT',
  //   },
  //   name: '所有的订单'
  // },
  // {
  //   fn: 'cancelFutureOrder',
  //   params: {
  //     order_id: ['975917330351104'],
  //     contract_type: 'quarter',
  //     pair: 'EOS-USDT',
  //   },
  //   name: '清空期货'
  // },
  // {
  //   fn: 'futureDepth',
  //   params: {
  //     pair: 'BTC-USDT',
  //     contract_type: 'quarter'
  //   },
  //   name: '深度数据'
  // },
  // {
  //   fn: 'batchFutureOrder',
  //   params: {
  //     pair: 'BTC-USDT',
  //     contract_type: 'quarter',
  //     lever_rate: 20,
  //     type: 'MARKET',
  //     side: 'BUY',
  //     direction: 'up',
  //     orders: [{ amount: 1 }]
  //   },
  //   name: '批量下单'
  // },
  // {
  //   fn: 'futureBalances',
  //   params: {
  //   },
  //   name: '期货资金'
  // },
  // {
  //   fn: 'unfinishedFutureOrderInfo',
  //   params: {
  //     pair: 'LTC-USDT',
  //     status: '1',
  //     contract_type: 'quarter',
  //     current_page: 0,
  //     page_length: 100
  //   },
  //   name: '未完成期货订单'
  // },
  // {
  //   fn: 'futureLedger',
  //   params: {
  //     pair: 'ETH-USDT',
  //     limit: 21,
  //     from: 1
  //   }
  // },
  // [
  //   {
  //     "pair": "EOS-USDT",
  //     "unique_id": "EOS-USDT_quarter",
  //     "contract_type": "quarter",
  //     "time": "2018-09-14T13:27:14.000Z",
  //     "buy_amount": 0,
  //     "buy_available": 0,
  //     "buy_price_avg": 0,
  //     "buy_price_cost": 0,
  //     "buy_profit_real": 296.70025018,
  //     "contract_id": 201812280200054,
  //     "lever_rate": 20,
  //     "sell_amount": 351,
  //     "sell_available": 351,
  //     "sell_price_avg": 5.44317002,
  //     "sell_price_cost": 5.58204008,
  //     "sell_profit_real": 296.70025018
  //   }

  // {
  //   fn: 'futurePosition',
  //   params: {
  //     contract_type: 'quarter',
  //     pair: 'EOS-USDT'
  //   },
  //   name: '期货仓位'
  // }
];

testRest(exchanges, tasks);
live();
