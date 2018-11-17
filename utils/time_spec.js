
const time = require('./time');
const base = require('./base');


function main() {
  const now = new Date();
  console.log(`今天是星期${time.getWeekDay()}`);
  const pre5 = time.prevWeek(now, 5, 1);
  const prevWeek5 = time.getTimeString(pre5, 'day');
  console.log(`今天的上周五是${prevWeek5}`);
  const pre51 = time.prevWeek(now - time.DAY * 2, 5, 1);
  const prevWeek51 = time.getTimeString(pre51, 'day');
  console.log(`前天的上周五是${prevWeek51}`);
  //
  const next5 = time.prevWeek(now, 5, -1);
  const nextWeek5 = time.getTimeString(next5, 'day');
  console.log(`今天的下周五是${nextWeek5}`);
  //
  const settlesQuarter = time.getSettlementTimes(now, 'quarter')
                  .map(t => time.getTimeString(t, 'day')).join(',');
  console.log(`最近的5个季度交割日是${settlesQuarter}`);
  const thisQSettleDay = time.getFutureSettlementDay(now, 'quarter');
  console.log(`当前的季度交割日是${thisQSettleDay}`);
  const thisQSettleMoveDay = time.getFutureSettlementMoveDay(now, 'quarter');
  console.log(`当前的季度第一次换仓日是${thisQSettleMoveDay}`);
  const prevQSettleDay = time.getFutureSettlementDay(now - time.QUARTER, 'quarter');
  console.log(`上一个季度交割日是${prevQSettleDay}`);

  // 测试一个过去的时间点...
  const testTimeStr = '2018-06-24';
  const testSettleDay = time.getFutureSettlementDay(testTimeStr, 'quarter');
  console.log(`${testTimeStr}的季度交割日是${testSettleDay}`);
  const testSettleMoveDay = time.getFutureSettlementMoveDay(testTimeStr, 'quarter');
  console.log(`${testTimeStr}的季度->次周换仓日是${testSettleMoveDay}`);
  //
  const settlesWeek = time.getSettlementTimes(now, 'this_week')
  .map(t => time.getTimeString(t, 'day')).join(',');
  console.log(`最近的5个当周、次周交割日是${settlesWeek}`);

  const thisNsettleDay = time.getFutureSettlementDay(now, 'next_week');
  console.log(`当前的次周交割日是${thisNsettleDay}`);
  const thisNsettleDayMove = time.getFutureSettlementMoveDay(now, 'next_week');
  console.log(`当前的次周->当周换仓日是${thisNsettleDayMove}`);
  const thisTsettleDay = time.getFutureSettlementDay(now, 'this_week');
  console.log(`当前的当周交割日是${thisTsettleDay}`);
}

main();
base.live();
