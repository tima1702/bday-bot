const index = require('./index');

test('divider', () => {
  expect(index.divider()).toEqual({ type: 'divider' });
});

test('confirm', () => {
  expect(index.confirm()).toEqual({});

  expect(index.confirm('TITLE', 'TEXT')).toEqual({
    title: {
      type: 'plain_text',
      text: 'TITLE',
    },
    text: {
      type: 'mrkdwn',
      text: 'TEXT',
    },
    confirm: {
      type: 'plain_text',
      text: 'Да',
    },
    deny: {
      type: 'plain_text',
      text: 'Стоп! Я передумал!',
    },
  });

  expect(index.confirm('TITLE', 'TEXT', 'CONFIRM', 'DENY')).toEqual({
    title: {
      type: 'plain_text',
      text: 'TITLE',
    },
    text: {
      type: 'mrkdwn',
      text: 'TEXT',
    },
    confirm: {
      type: 'plain_text',
      text: 'CONFIRM',
    },
    deny: {
      type: 'plain_text',
      text: 'DENY',
    },
  });
});
