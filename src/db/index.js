const weather = require('./weather');
const feedback = require('./feedback');
const feedbackTags = require('./feedbackTags');

function init() {
  weather.init();
  feedback.init();
  feedbackTags.init();
}

module.exports = { weather, feedback, feedbackTags, init };
