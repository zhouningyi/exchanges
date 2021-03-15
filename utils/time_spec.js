
const time = require('./time');
const base = require('./base');

const DAY = 3600 * 24 * 1000;
function main() {
  base.live();
  const now = new Date();
  console.log(`今天是星期${time.getWeekDay()}`);
  const pre5 = time.prevWeek(now, 5, 1);
  const prevWeek5 = time.getTimeString(pre5, 'day');
  console.log(`本周的上周五是${prevWeek5}`);
  const pre51 = time.prevWeek(now - time.DAY * 2, 5, 1);
  const prevWeek51 = time.getTimeString(pre51, 'day');
  console.log(`前天所在周的上周五是${prevWeek51}`);
  //
  const next5 = time.prevWeek(now, 5, -1);
  const nextWeek5 = time.getTimeString(next5, 'day');
  console.log(`今天的下周五是${nextWeek5}`);
  //
  const settlesQuarter = time.getSettlementTimes(now, 'QUARTER').map(t => time.getTimeString(t, 'day')).join(',');
  console.log(`最近的5个季度交割日是${settlesQuarter}`);
  const thisQSettleDay = time.getFutureSettlementDay(now, 'QUARTER');
  console.log(`当前的季度交割日是${thisQSettleDay}`);
  const thisQSettleMoveDay = time.getFutureSettlementMoveDay(now, 'QUARTER');
  console.log(`当前的季度第一次换仓日是${thisQSettleMoveDay}`);
  const prevQSettleDay = time.getFutureSettlementDay(now - time.QUARTER, 'QUARTER');
  console.log(`上一个季度交割日是${prevQSettleDay}`);

  // 测试一个过去的时间点...
  const testTimeStr = '2018-06-24';
  const testSettleDay = time.getFutureSettlementDay(testTimeStr, 'QUARTER');
  console.log(`${testTimeStr}的季度交割日是${testSettleDay}`);
  const testSettleMoveDay = time.getFutureSettlementMoveDay(testTimeStr, 'QUARTER');
  console.log(`${testTimeStr}的季度->次周换仓日是${testSettleMoveDay}`);
  //
  const settlesWeek = time.getSettlementTimes(now, 'THIS_WEEK').map(t => time.getTimeString(t, 'day')).join(',');
  console.log(`最近的5个当周、次周交割日是${settlesWeek}`);

  const thisNsettleDay = time.getFutureSettlementDay(now, 'NEXT_WEEK');
  console.log(`当前的次周交割日是${thisNsettleDay}`);
  const thisNsettleDayMove = time.getFutureSettlementMoveDay(now, 'NEXT_WEEK');
  console.log(`当前的次周->当周换仓日是${thisNsettleDayMove}`);
  const thisTsettleDay = time.getFutureSettlementDay(now, 'THIS_WEEK');
  console.log(`当前的当周交割日是${thisTsettleDay}`);
  //
  const current_month_delivery = time.getFutureSettlementTime2(now, 'MONTH-0');
  const next_month_delivery = time.getFutureSettlementTime2(now, 'MONTH-1');
  console.log(current_month_delivery, '当月交割...', next_month_delivery, '次月交割...');
  const t = '2021-01-29 16:02:00.000';
  console.log(t, '的当月合约交割日:', time.getFutureSettlementTime2(new Date(t), 'MONTH0'));

  //
}
// main();
console.log(2222);
module.exports = main;
