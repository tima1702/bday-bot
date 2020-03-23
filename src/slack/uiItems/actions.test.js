const actions = require('./actions');

test('button', () => {
  expect(actions.button()).toEqual({});

  expect(actions.button('title', 'value', 'actionId')).toEqual({
    type: 'button',
    text: {
      type: 'plain_text',
      text: 'title',
    },
    value: 'value',
    action_id: 'actionId',
  });

  expect(actions.button('title', 'value', 'actionId', { a: 1, b: 2 })).toEqual({
    type: 'button',
    text: {
      type: 'plain_text',
      text: 'title',
    },
    value: 'value',
    action_id: 'actionId',
    a: 1,
    b: 2,
  });
});
