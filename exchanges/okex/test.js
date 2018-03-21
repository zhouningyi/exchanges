
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

  const ds = await ex.depth({
    pair: 'ETH-BTC',
    // amount: 0.001,
    // side: 'BUY',
    // price: '0.0627',
    // type: 'LIMIT'
  });

  // const ds = await ex.balances({
  // });
  console.log(ds, 'ds...');
}

test(config.okexZhou);
