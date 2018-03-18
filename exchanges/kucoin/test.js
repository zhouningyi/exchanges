
const Exchange = require('./index');

const config = require('./../../config');

async function test(o) {
  const ex = new Exchange(o);
  const now = new Date().getTime();
  // const ds = await ex.ticks({
  //   // symbol: 'ETH-BTC',
  //   // startTime: now - 1000 * 60 * 10000,
  //   // endTime: now,
  //   // resolution: 1,
  //   // limit: 100
  // });

  const ds = await ex.coins({});

  // const ds = await ex.order({
  //   pair: 'ETH-BTC',
  //   // orderid: '5aacfdd39dda15139bb4ddbb',
  //   side: 'BUY',
  //   price: 0.07278,
  //   amount: 0.00005
  // });
  console.log(ds, 'ds...');
}

test(config.kucoinZhou);
