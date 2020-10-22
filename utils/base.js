

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

module.exports = { delay, cleanObjectNull, live };
