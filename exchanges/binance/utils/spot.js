const publicUtils = require('./public');
const _ = require('lodash');


const formatSpotContractDepth = publicUtils.formatDepth;

function _parse(v) {
  return parseFloat(v, 10);
}
function spotInterestO(o) {
  const { exchange,asset_type ,timestamp } = o;
  const res = { exchange ,asset_type,timestamp};
  if (o.timeStart) res.start = o.timeStart.toISOString();
  if (o.timeEnd) res.end = o.timeEnd.toISOString();
  return res;
}
function _formatInterest(d , o) {
  console.log(d,o,'_formatInterest_formatInterest')
  const exchange = 'BINANCE';
  const asset_type = 'SPOT';
  const time = new Date(d.interestAccuredTime);
  const pair = d.isolatedSymbol;
  const unique_id = `${exchange}_${asset_type}_${pair}`;
  return {
    time,
    unique_id,
    exchange,
    asset_type,
    interest: _parse(d.interest),
    interest_rate: _parse(d.interestRate),
    type: d.type,
    pair,
    principal:_parse(d.principal)
  };
}
function spotInterest(ds, o) {
  return _.map(ds,l=> _formatInterest(l,o));
}

module.exports = {
  formatSpotContractDepth,
  spotInterestO,
  spotInterest
};
