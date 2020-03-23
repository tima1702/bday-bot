const call = require('./call');
const uiItems = require('../uiItems');

test('start', () => {
  expect(call.start()).toEqual(uiItems.text.markdownSection('<!channel> *ВНИМАНИЕ:bangbang: Начался созвон!*'));

  expect(call.start(1234)).toEqual(
    uiItems.text.markdownSection('<!channel> *ВНИМАНИЕ:bangbang: У <@1234> начался созвон!*'),
  );
});

test('remind', () => {
  expect(call.remind()).toEqual(uiItems.text.markdownSection('<!channel> *Идет созвон. Просьба быть тише!!!* :angry:'));

  expect(call.remind(1234)).toEqual(
    uiItems.text.markdownSection('<!channel> *<@1234> напоминает что идет созвон, и просит быть тише!!!* :angry:'),
  );
});

test('stop', () => {
  expect(call.stop()).toEqual(uiItems.text.markdownSection('<!channel> *Закончился созвон!* :heavy_check_mark:'));

  expect(call.stop(1234)).toEqual(
    uiItems.text.markdownSection('<!channel> *У <@1234> закончился созвон!* :heavy_check_mark:'),
  );
});
