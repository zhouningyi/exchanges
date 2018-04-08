
const _ = require('lodash');
//
const Exchanges = require('./../index');
const config = require('./../config');
const { extrude, getAppKey } = require('./utils');


const PAIR = 'ETH-BTC';
async function test(exName) {
  const Exchange = Exchanges[exName];
  const ex = new Exchange(getAppKey(exName));
  const tick = await ex.ticks({ pair: PAIR });
  console.log(tick, 'tick...');
}

test('kucoin');
