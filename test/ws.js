
const _ = require('lodash');
//
const Exchanges = require('./../index');
const config = require('./../config');
const Utils = require('./utils');

const newtasks = [
  // ['wsFutureIndex', { pair: 'BTC-USD' }],
  // ['wsOptionMarkPrice', { pair: 'BTC-USD' }],
  // ['wsAssetTrades', { pair: 'BTC-USD', asset_type: 'SWAP' }],
  // ['wsCoinTrades', { coin: 'BTC', instrument: 'future', }],
  // ['wsAssetOrder', { pair: 'BTC-USD', asset_type: 'SWAP' }],
  // ['wsPortfolio', { coin: 'BTC' }],
  // ['wsAssetPosition', { pair: 'BTC-USD', asset_type: 'SWAP' }],
  // ['wsAssetTrade', { pair: 'BTC-USD', asset_type: 'SWAP' }],
  // ['wsAssetAnyChange', { pair: 'BTC-USD', asset_type: 'SWAP' }],
  // ['wsCoinContractDepth', { pair: 'BTC-USD', asset_type: 'QUARTER', level: 10 }],
  // ['wsCoinContractOrder', { pair: 'BTC-USD', asset_type: 'QUARTER' }],
  // ['wsCoinContractPositions', {}],
  // ['wsCoinContractBalances', { }]
  // ['wsAssetDepth', { pair: ['ETH-USD', 'BTC-USD'], asset_type: ['swap', 'next_quarter'] }],
  // ['wsAssetOrder', { pair: ['ETH-USD', 'BTC-USD'], asset_type: ['swap', 'next_quarter'] }],
  // ['wsAssetPositions', { pair: ['ETH-USD', 'BTC-USD'], asset_type: ['swap', 'next_quarter'] }],
  ['wsAssetBalances', { pair: ['ETH-USD', 'BTC-USD'], asset_type: ['swap', 'next_quarter'] }]
];

const wsList = [
  ...newtasks.map(([fn, params]) => ({ fn, params })),
  // {
  //   fn: 'wsAssetDepth',
  //   params: {
  //     pair: 'BTC-USD',
  //     asset_type: 'SWAP',
  //     group: 2,
  //     depth: 10
  //   },
  //   name: 'wsTicks'
  // },

  // {
  //   fn: 'wsTicks',
  //   params: {
  //     pairs: ['BTC-USD', 'BTC-EOS']
  //   },
  //   name: 'wsTicks'
  // },

  // {
  //   fn: 'wsSpotBalance',
  //   params: {
  //     pairs: ['XRP-USDT', 'EOS-USDT']
  //   },
  //   name: 'spotBalance'
  // },
  // {
  //   fn: 'wsSpotOrders',
  //   params: {
  //     pairs: ['XRP-USDT', 'EOS-USDT']
  //   },
  //   name: 'wsSpotOrders'
  // },

  // {
  //   fn: 'wsFutureTicks',
  //   params: {
  //     contract_type: ['this_week', 'quarter', 'next_week'], // 'quarter',
  //     pairs: ['BTC-USD']
  //   },
  //   name: '期货tick数据111211...'
  // },
  // {
  //   fn: 'wsSwapTicks',
  //   params: {
  //     pairs: ['BTC-USD', 'ETH-USD', 'EOS-USD']
  //   },
  //   name: '永续合约tick...'
  // },
  // {
  //   fn: 'wsSwapDepth',
  //   params: {
  //     pairs: ['BTC-USD']
  //   },
  //   name: '永续合约tick...'
  // },
  // {
  //   fn: 'wsFutureBalance',
  //   params: {
  //     coins: ['EOS', 'ETH'],
  //   },
  //   name: 'wsFutureBalance'
  // },
  // {
  //   fn: 'wsFutureIndex',
  //   params: {
  //     pairs: [
  //       'BTC-USD' // 'EOS-USD',
  //     ]
  //   },
  //   name: '合约指数'
  // },
  // {
  //   fn: 'wsFutureOrders',
  //   params: {
  //     pairs: ['BTC-USD'],
  //     contract_type: 'this_week'
  //   },
  //   name: ''
  // },
  // {
  //   fn: 'wsFuturePosition',
  //   params: {
  //     pairs: ['ETH-USD'],
  //     contract_type: ['quarter']
  //   },
  //   name: ''
  // },
  // {
  //   fn: 'wsBalance',
  //   params: {
  //     coins: ['BTC', 'EOS', 'USDT']
  //   },
  //   name: '余额数据'
  // },
  // {
  //   fn: 'wsReqBalance',
  //   params: {
  //   },
  //   name: '余额数据'
  // },


  // {
  //   fn: 'wsReqOrders',
  //   params: {
  //     pairs: ['EOS-USDT']
  //   },
  // },

  // {
  //   fn: 'wsOrders',
  //   params: {
  //     pairs: ['BTC-USDT']
  //   },
  //   name: '登录'
  // },

  // {
  //   fn: 'wsFutureKlines',
  //   params: {
  //   },
  //   name: '期货tick k线图...'
  // },
  // {
  //   fn: 'wsKline',
  //   params: {
  //     pairs: ['BTC-USD'],
  //     interval: 5
  //   },
  //   name: '现货tick k线图...(指定pair)'
  // },
  // {
  //   fn: 'wsFutureDepth',
  //   params: {
  //     contract_type: 'quarter',
  //     pairs: ['EOS-USDT']
  //   },
  //   name: '期货深度图'
  // },

  // {
  //   fn: 'wsFutureDepth',
  //   params: {
  //     contract_type: ['this_week', 'next_week', 'quarter'],
  //     pairs: ['EOS-USDT']
  //   },
  //   name: '期货深度图'
  // },

  // {
  //   fn: 'wsDepth',
  //   params: {
  //     pairs: ['BTC-USDT', 'EOS-USDT'], // 'BTC-USDT',
  //     depth: 100
  //   },
  //   name: '深度图'
  // },

  // {
  //   fn: 'wsSwapBalance',
  //   params: {
  //     pairs: ['ETH-USD', 'EOS-USD'], // 'BTC-USDT',
  //   },
  //   name: '永续账户'
  // },

  // {
  //   fn: 'wsSwapPosition',
  //   params: {
  //     pairs: ['ETH-USD', 'EOS-USD'], // 'BTC-USDT',
  //   },
  //   name: '永续账户'
  // },

  // {
  //   fn: 'wsSwapOrder',
  //   params: {
  //     pairs: ['ETH-USD', 'EOS-USD'], // 'BTC-USDT',
  //   },
  //   name: '永续订单'
  // },


  // {
  //   fn: 'wsFutureBalance',
  //   params: {
  //   },
  //   name: 'ws的余额'
  // },
];

function testOneExchangeWs(exName, list) {
  const ex = Utils.getExchange(exName);
  _.forEach(list, (o) => {
    const { fn, params } = o;
    ex[fn](params, (ds) => {
      console.log(ds, fn);
    });
  });
}

const exchangeName = 'binance';

console.log(`=============【${exchangeName}...】=============`);
testOneExchangeWs(exchangeName, wsList);
Utils.live();
