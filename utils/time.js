
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
const SETTLEMENT_QUARTER_MONTHES = ['2019-03-29', '2019-06-28', '2019-09-27', '2019-12-27', '2020-03-27', '2020-06-26', '2020-09-25', '2020-12-25', '2021-03-26', '2021-06-25', '2021-09-24'];
function getSettlementTimes(t = new Date(), type = 'QUARTER') { // 今年4个季度以及明年三个季度
  type = type.toUpperCase();
  t = fixTime(t);
  if (type === 'QUARTER' || type === 'NEXT_QUARTER') {
    return SETTLEMENT_QUARTER_MONTHES
         .map(v => new Date(`${v} ${SETTLE_TIME}`));
  } else if (type === 'THIS_WEEK' || type === 'NEXT_WEEK') {
    return [prevWeek(t, 5, 0), prevWeek(t, 5, -1), prevWeek(t, 5, -2), prevWeek(t, 5, -3)]
           .map(t => new Date(`${getTimeString(t, 'day')} ${SETTLE_TIME}`));
  }
  console.log(type, '❌getSettlementDays type错误...');
}
// ✅
function getFutureSettlementDay(t, type = 'QUARTER') {
  const time = getFutureSettlementTime(t, type);
  return getTimeString(time, 'day');
}


function getClosetNextWeek5(t) {
  const tlong = t.getTime();
  for (i = 0; i <= 7; i += 1) {
    const newt = new Date(tlong + i * DAY);
    if (getWeekDay(newt) === 5) {
      const year = t.getFullYear();
      const month = _fix10(t.getMonth() + 1);
      const day = _fix10(t.getDate());
      const timestring = `${year}-${month}-${day} 16:00:00`;
      return new Date(timestring);
    }
  }
}

function getMonthDeliveryTime(t, type) {
  let year = t.getFullYear();
  let month = t.getMonth() + 1;
  if (type === 'NEXT_MONTH_1') {
    if (month === 12) {
      year += 1;
      month = 1;
    } else {
      month += 1;
    }
    const day_str = `${year}-${_fix10(month)}-01`;
    t = new Date(`${day_str} 12:00:00`);
  }
  const month_str = _fix10(month);

  const day = 21;
  const tLongStart = new Date(`${year}-${month_str}-${day} 16:00:00`).getTime();
  let deliver_time = null;
  for (let i = 0; i <= 10; i += 1) {
    const _t = new Date(tLongStart + i * DAY);
    const _month = _t.getMonth() + 1;
    if (getWeekDay(_t) === 5) deliver_time = _t;
    if (_month > month) return deliver_time;
  }
  return deliver_time;
}

function getFutureSettlementTime2(t = new Date(), type = 'MONTH-0') {
  let delta_month = 0;
  let month_n = parseInt(type.split('-')[1], 10);
  if (type.startsWith('MONTH')) {
    if (month_n > 1) {
      delta_month = month_n - 1;
      month_n = 1;
    }
  }
  t = new Date(t.getTime() + delta_month * 30 * DAY);
  const m_type = month_n > 0 ? 'NEXT_MONTH_1' : null;
  const current_dilivery_time = getMonthDeliveryTime(t, m_type);
  if (current_dilivery_time - t > 0) return current_dilivery_time;
  const next_t = new Date(t.getTime() + delta_month * 30 * DAY);
  return getMonthDeliveryTime(next_t, 'NEXT_MONTH_1');
}


function getFutureSettlementTime(t, type = 'QUARTER', mode = 'okex') {
  type = type.toUpperCase();
  t = fixTime(t);
  const setts = getSettlementTimes(t, type);
  const preDeliveryInterval = mode === 'okex' ? WEEK : 0;
  for (let i = 0; i < setts.length; i++) {
    const st = setts[i];
    const dt = st - t;
    if (type === 'NEXT_QUARTER') {
      const pst = setts[i - 1];
      if (pst) {
        const dpst = pst - t;
        if (dpst > 2 * preDeliveryInterval) {
          return st;
        }
      }
    } else if (type === 'QUARTER') {
      if (dt > preDeliveryInterval * 2) {
        return st;
      }
    } else if (type === 'NEXT_WEEK') {
      if (dt > preDeliveryInterval && dt <= 2 * preDeliveryInterval) {
        return st;
      }
    } else if (type === 'THIS_WEEK') {
      if (dt > 0 && dt <= preDeliveryInterval) {
        return st;
      }
    }
  }
  console.log('getQuarterFutureSettlementDay 出错', type);
  process.exit();
  return null;
}

// 合约挪动仓位的时间(对季度合约是第一次移动仓位时间)
function getFutureSettlementMoveTime(t = new Date(), type = 'QUARTER') {
  if (type === 'THIS_WEEK') return console.log('getFutureSettlementMoveDay: 当周期货无移动仓位');
  const set = getFutureSettlementTime(t, type);
  if (type === 'QUARTER') {
    return prevWeek(set, 5, 2);
  }
  if (type === 'NEXT_WEEK') {
    return prevWeek(set, 5, 1);
  }
  console.log('❌getFutureSettlementMoveTime 错误...');
}

function getFutureSettlementMoveDay(t = new Date(), type = 'QUARTER') {
  const time = getFutureSettlementMoveTime(t, type);
  return getTimeString(time, 'day');
}


function getSwapFundingTime(asset, time = new Date()) {
  const { exchange } = asset;
  if (!['FTX', 'DERIBIT'].includes(exchange)) {
    const day = getTimeString(time, 'day');
    const hour = time.getHours();
    if (hour > 16) return new Date(`${day} 16:00:00`);
    if (hour > 8) return new Date(`${day} 08:00:00`);
    return new Date(`${day} 00:00:00`);
  }
}


module.exports = {
  getSwapFundingTime,
  SETTLEMENT_QUARTER_MONTHES,
  getTimeString,
  getWeekDay,
  DAY,
  QUARTER,
  prevWeek,
  WEEK,
  //
  getFutureSettlementTime2,
  getSettlementTimes,
  getFutureSettlementDay,
  getFutureSettlementTime,
  getFutureSettlementMoveDay,
  getFutureSettlementMoveTime,
};
