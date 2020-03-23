const text = require('./text');
const actions = require('./actions');
const modal = require('./modal');

function divider() {
  return { type: 'divider' };
}

function confirm(title, text, confirm = 'Да', deny = 'Стоп! Я передумал!') {
  if (!title || !text) {
    console.error('In Confirm required fields: title, text');
    return {};
  }

  return {
    title: {
      type: 'plain_text',
      text: title,
    },
    text: {
      type: 'mrkdwn',
      text: text,
    },
    confirm: {
      type: 'plain_text',
      text: confirm,
    },
    deny: {
      type: 'plain_text',
      text: deny,
    },
  };
}

module.exports = { text, divider, confirm, actions, modal };
