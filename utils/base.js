
const Console = require('./console');
const _ = require('lodash');

function delay(time) {
  return new Promise(resolve => setTimeout(() => resolve('delay'), time));
}

function cleanObjectNull(o, isDeleteNull = false) {
  let v;
  for (const k in o) {
    v = o[k];
    if (v === undefined || v === '') delete o[k];
    if (v === null && isDeleteNull) delete o[k];
    if (isNaN(v) && typeof (v) === 'number') delete o[k];
  }
  return o;
}

function live() {
  setTimeout(() => {}, 100000000);
}
function isNull(v) {
  return v === undefined || v === null || v === '';
}
function _handelNull(k) {
  Console.print(`${k}的值不能为空`, 'red');
  process.exit();
}

function checkKey(o, vs) {
  if (Array.isArray(vs)) {
    vs = _.keyBy(vs, v => v);
    _.forEach(vs, (k) => {
      if (isNull(o[k])) _handelNull(k);
    });
  } else if (isNull(o[vs])) _handelNull(vs);
}
module.exports = { delay, cleanObjectNull, checkKey, live };
