function markdownSection(text = '', args = {}) {
  if (!text) {
    console.error('In Text markdownSection required field: text');
    return {};
  }

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
  if (!text) {
    console.error('In Text markdownContext required field: text');
    return {};
  }

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
