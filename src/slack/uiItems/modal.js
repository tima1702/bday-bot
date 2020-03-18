function create(title, callbackId, blocks = [], attr = {}, submit = 'Сохранить', close = 'Отмена') {
  return {
    type: 'modal',
    callback_id: callbackId,
    title: {
      type: 'plain_text',
      text: title,
    },
    submit: {
      type: 'plain_text',
      text: submit,
    },
    close: {
      type: 'plain_text',
      text: close,
    },
    blocks,
    ...attr,
  };
}

module.exports = { create };
