const chalk = require('chalk');

// 与命令行打印有关
function printL(str) {
  const longs = ' ----------- ';
  print(longs + str + longs);
}

function print(str, color) {
  color = color || 'green';
  const content = chalk[color](str);
  console.log(content);
}

function warn(str, color) {
  color = color || 'red';
  const longs = '=============';
  const content = chalk[color](longs + str + longs);
  console.log(content);
}

const warnExit = (text) => {
  warn(`${text}\n`);
  process.exit();
};

const printByIndex = (str, i, interval, color) => {
  if (i % interval === 0) print(str, color);
};

module.exports = {
  printByIndex,
  printL,
  print,
  warn,
  warnExit
};

