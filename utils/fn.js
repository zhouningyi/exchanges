
const { delay } = require('./base');
const { print } = require('./console');


const defaultO = {
  timeout: 1500,
  retry: 0
};

function wrapFn(fn, o = {}, isPrint, fnName) {
  if (typeof fn !== 'function') throw 'genFn: fn必须是函数';
  o = { ...defaultO, ...o };
  const { timeout = 1000, retry = 0 } = o;
  let retryIndex = 0;
  const f = async (a, b, c, d) => {
    const tasks = [delay(timeout), fn(a, b, c, d)];
    const info = await Promise.race(tasks);
    if (isPrint && retryIndex > 0) print(`${fnName}重试${retryIndex}次`);
    if (!info) {
      if (retryIndex >= retry) {
        retryIndex = 0;
        return false;
      } else {
        retryIndex += 1;
        const ds = await f(a, b, c, d);
        return ds;
      }
    }
    retryIndex = 0;
    return info;
  };
  return f;
}


module.exports = {
  wrapFn
};
