
const _ = require('lodash');
//
const Exchanges = require('./../index');
const config = require('./../config');
const Utils = require('./utils');

const wsList = [
  // {
  //   fn: 'wsTicks',
  //   params: {},
  //   name: 'tick数据...'
  // },
  // {
  //   fn: 'wsFutureTicks',
  //   params: {},
  //   name: '期货tick数据...'
  // },
  // {
  //   fn: 'wsBalance',
  //   params: {},
  //   name: '期货余额数据'
  // },
  {
    fn: 'wsFutureKline',
    params: {
      pair: 'BTC-USD'
    },
    name: '期货tick k线图...'
  },
];

function testOneExchangeWs(exName, list) {
  const ex = Utils.getExchange(exName);
  _.forEach(list, (o) => {
    const { fn, params } = o;
    ex[fn](params, (ds) => {
      console.log(ds, 'ds.222..');
    });
  });
}

testOneExchangeWs('okex', wsList);

