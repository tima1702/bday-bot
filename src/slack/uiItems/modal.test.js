const modal = require('./modal');

test('create', () => {
  expect(modal.create()).toEqual({});

  expect(modal.create('title', 'callbackId')).toEqual({
    type: 'modal',
    callback_id: 'callbackId',
    title: {
      type: 'plain_text',
      text: 'title',
    },
    submit: {
      type: 'plain_text',
      text: 'Сохранить',
    },
    close: {
      type: 'plain_text',
      text: 'Отмена',
    },
    blocks: [],
  });

  expect(modal.create('title', 'callbackId', [{ a: 1 }, { b: 2 }], { a: 1 }, 'SUBMIT', 'CLOSE')).toEqual({
    type: 'modal',
    callback_id: 'callbackId',
    title: {
      type: 'plain_text',
      text: 'title',
    },
    submit: {
      type: 'plain_text',
      text: 'SUBMIT',
    },
    close: {
      type: 'plain_text',
      text: 'CLOSE',
    },
    blocks: [{ a: 1 }, { b: 2 }],
    a: 1,
  });
});
