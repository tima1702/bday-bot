const weather = require('./weather');
const feedback = require('./feedback');

function init() {
  weather.init();
  feedback.init();
}

module.exports = { weather, feedback, init };
