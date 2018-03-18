
const Exchange = require('./index');

const config = require('./../../config');

async function test(o) {
  const ex = new Exchange(o);
  const now = new Date().getTime();
  const ds = await ex.depth({
    pair: 'ETH-BTC',
    // startTime: now - 1000 * 60 * 10000,
    // endTime: now,
    // interval: '1m',
    // limit: 500
  });
  // const ds1 = await ex.prices({});
  console.log(ds, 'ds...');
}

test(config.binanceZhou);
