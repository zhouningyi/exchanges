
const _ = require('lodash');
//

const config = require('./../config');
const { getExchange } = require('./utils');
const Utils = require('./../utils');


async function main(pair = 'BTC-USDT', contract_type = 'quarter') {
  const ex = getExchange('okex');
  const futureDepth = await ex.futureDepth({ pair, contract_type, size: 3 });
  const { asks } = futureDepth;
  const orders = [{
    price: asks[0].price + 100,
    amount: 1,
  }, {
    price: asks[1].price + 100,
    amount: 1,
  }];
  const orderO = {
    pair: 'BTC-USDT',
    type: 'LIMIT',
    side: 'BUY',
    direction: 'down',
    contract_type: 'quarter',
    lever_rate: 10,
    orders
  };
  const ds = await ex.batchFutureOrder(orderO);
  // await ex.cancelAllFutureOrders();
  // console.log(ds);
}

main();
