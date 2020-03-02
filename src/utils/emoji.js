const numberEmoji = {
  '0': ':zero:',
  '1': ':one:',
  '2': ':two:',
  '3': ':three:',
  '4': ':four:',
  '5': ':five:',
  '6': ':six:',
  '7': ':seven:',
  '8': ':eight:',
  '9': ':nine:',
};

function numberToEmoji(number) {
  let str = '';
  `${number}`.split('').forEach((item) => (str += numberEmoji[item] || ''));

  return str;
}

module.exports = {
  numberToEmoji,
};
