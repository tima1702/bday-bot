function button(title, value, actionId, attr = {}) {
  if (!title || !value || !actionId) {
    console.error('In Button required fields: title, value, actionId');
    return {};
  }

  return {
    type: 'button',
    text: {
      type: 'plain_text',
      text: title,
    },
    value,
    action_id: actionId,
    ...attr,
  };
}

module.exports = { button };
