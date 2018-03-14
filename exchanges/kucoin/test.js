
const Exchange = require('./index');


async function test(o) {
  const ex = new Exchange(o);
  // const ds = await ex.kline({
  //   symbol: 'ETH-BTC',
  //   from: 'BTC',
  //   to: 'ETH'
  // });
  const ds = await ex.orders({
    symbol: 'ETH-BTC'
  });
  console.log(ds, 'ds...');
}

test({
  apiKey: "5a8733bf72455a83974f0f9a",
  apiSecret: "70531b11-461f-4fef-95af-a98d619ba835"
});
