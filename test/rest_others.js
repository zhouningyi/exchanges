const { testRest } = require('./utils');

const exchanges = ['okex'];// , ''. 'hitbtc' 'bittrex'

const tasks = [
  {
    fn: 'print',
    params: '正在测试 print 函数',
    name: '测试print函数'
  },
  {
    fn: 'wrap',
    params: {},
    name: '包装器'
  },
];

testRest(exchanges, tasks);
