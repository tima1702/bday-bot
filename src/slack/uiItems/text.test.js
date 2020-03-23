const text = require('./text');

test('markdownSection', () => {
  expect(text.markdownSection()).toEqual({});

  expect(text.markdownSection('text')).toEqual({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'text',
    },
  });

  expect(text.markdownSection('text', { a: 1, b: 2 })).toEqual({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'text',
    },
    a: 1,
    b: 2,
  });
});

test('markdownContext', () => {
  expect(text.markdownContext()).toEqual({});

  expect(text.markdownContext('text')).toEqual({
    type: 'context',
    text: {
      type: 'mrkdwn',
      text: 'text',
    },
  });

  expect(text.markdownContext('text', { a: 1, b: 2 })).toEqual({
    type: 'context',
    text: {
      type: 'mrkdwn',
      text: 'text',
    },
    a: 1,
    b: 2,
  });
});
