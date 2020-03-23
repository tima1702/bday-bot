const permission = require('./permission');
const uiItems = require('../uiItems');

test('accessDeniedBlocks', () => {
  expect(permission.accessDeniedBlocks()).toEqual([
    uiItems.text.markdownSection(':bangbang:*Ошибка! Доступ к этому функционалу запрещен!*:lock:'),
  ]);
});
