function button(title, value, actionId, attr = {}) {
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
