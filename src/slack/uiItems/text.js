function markdownSection(text = '') {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: text,
    },
  };
}

function markdownContext(text = '') {
  return {
    type: 'context',
    text: {
      type: 'mrkdwn',
      text: text,
    },
  };
}

module.exports = { markdownSection, markdownContext };
