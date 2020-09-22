// const _ = require('lodash');

const orderTypes = [
  { id: 'NORMAL', name: '普通单' },
  { id: 'MAKER', name: '仅maker单' },
  { id: 'FOK', name: 'FOK' },
  { id: 'IOC', name: '马上成交或撤销' }
];

function getMapMap(arr) {
  const res = {};
  for (const i in arr) {
    const l = arr[i];
    const { id } = l;
    res[id] = id;
  }
  return res;
}

const metas = {
  orderTypes
};

function getMetaMap(metas) {
  const metaMap = {};
  for (const name in metas) {
    const meta = metas[name];
    const mapmap = getMapMap(meta);
    metaMap[name] = { mapmap };
  }
  return metaMap;
}

function getId(name) {
}
const metaMap = getMetaMap();
module.exports = {
  orderTypes,
  getMapMap
};
