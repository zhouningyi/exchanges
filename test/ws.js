
const _ = require('lodash');
//
const Exchanges = require('./../index');
const config = require('./../config');

const wsList = [
  {
    fn: 'wsTicks',
    params: {},
    name: 'tick数据...'
  }
];

function testOneExchangeWs(exName, list) {
  const keyName = `${exName}Zhou`;
  const Exchange = Exchanges[exName];
  const ex = new Exchange(config[keyName]);
  _.forEach(list, (o) => {
    const { fn, params } = o;
    ex[fn](params, (ds) => {
      console.log(ds);
    });
  });
}

testOneExchangeWs('okex', wsList);

