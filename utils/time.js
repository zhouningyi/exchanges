
const DAY = 3600 * 24 * 1000;
const WEEK = DAY * 7;
const QUARTER = 365 * DAY / 4;

// function _floor(t) {
//   if (t >= 0) return Math.floor(t);
//   return -Math.floor(Math.abs(t));
// }

function getWeekDay(t) {
  t = fixTime(t);
  const tEnd = new Date(`${getTimeString(t, 'day')} 00:00:01`);
  const tstart = new Date('2018-07-02 00:00:01');
  const dt = tEnd.getTime() + 10000000 * WEEK - tstart.getTime();
  const dday = dt / DAY;
  const weekIndex = 1 + Math.round((dday) % 7);
  // weekIndex = (weekIndex < 0 ? 7 + weekIndex : weekIndex) + 1;
  return weekIndex;
}

// 计算上周的周几是哪一天
function prevWeek(t = new Date(), index, weekN) {
  const preWeekNow = t - WEEK * weekN;
  const weekIndex = getWeekDay(preWeekNow);
  return new Date(preWeekNow + DAY * (index - weekIndex));
}

function fixTime(t) {
  t = t || new Date();
  if (typeof t === 'string') t = new Date(t);
  if (typeof t === 'number') t = new Date(t);
  return t;
}

function _fix10(v) {
  if (v < 10) return `0${v}`;
  return `${v}`;
}

function getTimeString(t, type = 'day') {
  if (!t || typeof t !== 'object') return ' null ';
  const year = t.getFullYear();
  const month = _fix10(t.getMonth() + 1);
  const day = _fix10(t.getDate());

  const hour = _fix10(t.getHours());
  const minite = _fix10(t.getMinutes());
  const second = _fix10(t.getSeconds());
  // const miliDigit = Math.pow(10, digit);
  // const milisec = Math.floor(((t.getMilliseconds() / 60) % 1) * miliDigit);
  const dayStr = `${year}-${month}-${day}`;
  if (type === 'day') return dayStr;
  if (type === 'hour') return `${dayStr} ${hour}`;
  if (type === 'second') return `${dayStr} ${hour}:${minite}:${second}`;
  console.log('type 不正确...');
  return false;
}

//
const SETTLE_TIME = '16:10:00';
const SETTLEMENT_QUARTER_MONTHES = ['2019-03-29', '2019-06-28', '2019-09-27', '2019-12-27', '2020-03-27'];
function getSettlementTimes(t = new Date(), type = 'quarter') { // 今年4个季度以及明年三个季度
  t = fixTime(t);
  if (type === 'quarter') {
    return SETTLEMENT_QUARTER_MONTHES
         .map((v) => {
           return new Date(`${v} ${SETTLE_TIME}`);
         });
  } else if (type === 'this_week' || type === 'next_week') {
    return [prevWeek(t, 5, 0), prevWeek(t, 5, -1), prevWeek(t, 5, -2), prevWeek(t, 5, -3)]
           .map(t => new Date(`${getTimeString(t, 'day')} ${SETTLE_TIME}`));
  }
  console.log(type, '❌getSettlementDays type错误...');
}
// ✅
function getFutureSettlementDay(t, type = 'quarter') {
  const time = getFutureSettlementTime(t, type);
  return getTimeString(time, 'day');
}

function getFutureSettlementTime(t, type = 'quarter') {
  t = fixTime(t);
  const setts = getSettlementTimes(t, type);
  for (let i = 0; i < setts.length; i++) {
    const st = setts[i];
    const dt = st - t;
    if (type === 'quarter') {
      if (dt > WEEK * 2) return st;
    } else if (type === 'next_week') {
      if (dt > WEEK && dt <= 2 * WEEK) {
        return st;
      }
    } else if (type === 'this_week') {
      if (dt > 0 && dt <= WEEK) {
        return st;
      }
    }
  }
  console.log('getQuarterFutureSettlementDay 出错');
  process.exit();
  return null;
}

// 合约挪动仓位的时间(对季度合约是第一次移动仓位时间)
function getFutureSettlementMoveTime(t = new Date(), type = 'quarter') {
  if (type === 'this_week') return console.log('getFutureSettlementMoveDay: 当周期货无移动仓位');
  const set = getFutureSettlementTime(t, type);
  if (type === 'quarter') {
    return prevWeek(set, 5, 2);
  }
  if (type === 'next_week') {
    return prevWeek(set, 5, 1);
  }
  console.log('❌getFutureSettlementMoveTime 错误...');
}

function getFutureSettlementMoveDay(t = new Date(), type = 'quarter') {
  const time = getFutureSettlementMoveTime(t, type);
  return getTimeString(time, 'day');
}

module.exports = {
  getTimeString,
  getWeekDay,
  DAY,
  QUARTER,
  prevWeek,
  WEEK,
  //
  getSettlementTimes,
  getFutureSettlementDay,
  getFutureSettlementTime,
  getFutureSettlementMoveDay,
  getFutureSettlementMoveTime,
};
