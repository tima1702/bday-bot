function timeToString(time) {
  return +time < 10 ? `0${time}` : `${time}`;
}

function calcDuration(hour, minute, duration) {
  const all = +hour * 60 + +minute + +duration;
  const newHour = (all - (all % 60)) / 60;
  const newMinute = all - newHour * 60;
  return `${timeToString(newHour >= 24 ? newHour - 24 : newHour)}:${timeToString(newMinute)}`;
}

module.exports = { timeToString, calcDuration };
