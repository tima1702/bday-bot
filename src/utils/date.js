const time = require('./time');

function getCurrentDate(dt) {
  const now = dt ? new Date(dt) : new Date();
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000);
}

function printDate(dt) {
  const date = getCurrentDate(dt * 1000);

  return (
    `${time.timeToString(date.getDate())}.${time.timeToString(date.getMonth() + 1)} ${time.timeToString(
      date.getHours(),
    )}:${time.timeToString(date.getMinutes())}` || ''
  );
}

module.exports = { printDate, getCurrentDate };
