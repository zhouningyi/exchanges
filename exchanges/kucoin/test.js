
const Exchange = require('./index');


async function test(o) {
  const ex = new Exchange(o);
  const now = new Date().getTime();
  // const ds = await ex.kline({
  //   symbol: 'ETH-BTC',
  //   from: now - 1000 * 60 * 10000,
  //   to: now,
  //   resolution: 1,
  //   limit: '100'
  // });
  // const ds = await ex.order({
  //   coin: 'ETH-BTC',
  //   type: 'sell',
  //   amount: 0.001
  // });
  const ds = await ex.balances({
    // coin: 'ETH-BTC',
  });
  console.log(ds, 'ds...');
}

test({
  apiKey: "5a8733bf72455a83974f0f9a",
  apiSecret: "70531b11-461f-4fef-95af-a98d619ba835"
});
