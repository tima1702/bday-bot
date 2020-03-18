function markdownSection(text = '', args = {}) {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: text,
    },
    ...args,
  };
}

function markdownContext(text = '', args = {}) {
  return {
    type: 'context',
    text: {
      type: 'mrkdwn',
      text: text,
    },
    ...args,
  };
}

module.exports = { markdownSection, markdownContext };
