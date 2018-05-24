
const { delay } = require('./base');


const defaultO = {
  timeout: 1500,
  retryN: 0
};

function wrapFn(fn, o = {}) {
  if (typeof fn !== 'function') throw 'genFn: fn必须是函数';
  o = { ...defaultO, ...o };
  const { timeout = 1000, retryN = 0 } = o;
  let retryIndex = 0;
  const f = async (a, b, c, d) => {
    const tasks = [delay(timeout), fn(a, b, c, d)];
    const info = await Promise.race(tasks);
    if (!info) {
      if (retryIndex >= retryN) {
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
