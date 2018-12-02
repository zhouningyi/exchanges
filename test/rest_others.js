const { testRest } = require('./utils');

const exchanges = ['okex'];// , ''. 'hitbtc' 'bittrex'

const tasks = [
  // {
  //   fn: 'print',
  //   params: '正在测试 print 函数',
  //   name: '测试print函数'
  // },
  {
    fn: 'wrap',
    params: {
      test: {
        timeout: 200,
        rateLimit: 20000,
        retry: 2
      },
    },
    name: '包装器'
  },
  {
    fn: 'test',
    params: {},
    name: 'test'
  },
  {
    fn: 'test',
    params: {},
    name: 'test'
  }
];

testRest(exchanges, tasks);
