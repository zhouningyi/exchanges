
const _ = require('lodash');

function _exist(d){
  return d !== undefined && d !== null;
}
function _replace(o={}, kFrom, kTo){
  const v = o[kFrom];
  if (!_exist(v)) return o;
  o[kTo] = v;
  delete o[kFrom];
  return o;
}

function replace(o, replaces){
  o = {...o};
  _.forEach(replaces, (kTo, kFrom) => {
    _replace(o, kFrom, kTo);
  });
  return o;
}

module.exports = {
  replace
};