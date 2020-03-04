const time = require('./time');

function printDate(dt) {
  const date = new Date(dt * 1000);

  return (
    `${time.timeToString(date.getDate())}.${time.timeToString(date.getMonth() + 1)} ${time.timeToString(
      date.getHours(),
    )}:${time.timeToString(date.getMinutes())}` || ''
  );
}

module.exports = { printDate };
