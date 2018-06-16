
const _ = require('lodash');
//
const Exchanges = require('./../index');
const config = require('./../config');
const Utils = require('./utils');

const wsList = [
  {
    fn: 'wsTicks',
    params: {},
    name: 'tick数据...'
  },
  // {
  //   fn: 'wsFutureTicks',
  //   params: {
  //     contract_type: ['this_week', 'quarter', 'next_week'],
  //     pairs: ['EOS-USDT']
  //   },
  //   name: '期货tick数据...'
  // },
  // {
  //   fn: 'wsBalance',
  //   params: {},
  //   name: '期货余额数据'
  // },
  // {
  //   fn: 'wsFutureKlines',
  //   params: {
  //   },
  //   name: '期货tick k线图...'
  // },
  // {
  //   fn: 'wsFutureKline',
  //   params: {
  //     pair: 'BTC-USD'
  //   },
  //   name: '期货tick k线图...(指定pair)'
  // },
  // {
  //   fn: 'wsFutureDepth',
  //   params: {
  //     contract_type: 'quarter'
  //   },
  //   name: '期货深度图'
  // },
  // {
  //   fn: 'wsDepth',
  //   params: {
  //     contract_type: 'quarter',
  //     pairs: ['BTC-USDT', 'EOS-USDT']
  //   },
  //   name: '深度图'
  // },
  // {
  //   fn: 'wsFutureBalances',
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
      console.log(ds, 'ds test...');
    });
  });
}

testOneExchangeWs('fcoin', wsList);

