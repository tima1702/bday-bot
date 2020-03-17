const dbApp = require('../../../db');

function add(view, channelId, userId) {
  const tagValue = view.state.values.tagName.actionTagName.value || '';

  dbApp.feedbackTags
    .add(tagValue.toLowerCase())
    .then(() => {
      console.log('..........THEN');
    })
    .catch(() => {
      console.log('..........CATCH');
    });

  return {
    response_action: 'clear',
  };
}

module.exports = { add };
