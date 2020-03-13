const channels = require('./channels');
const admins = require('./admins');
const ventillation = require('./ventillation');

function init() {
  channels.init();
  admins.init();
  ventillation.init();
}

module.exports = { channels, admins, ventillation, init };
