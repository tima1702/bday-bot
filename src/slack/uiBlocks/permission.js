const uiItems = require('../uiItems');

function accessDeniedBlocks() {
  return [uiItems.text.markdownSection(':bangbang:*Ошибка! Доступ к этому функционалу запрещен!*:lock:')];
}

module.exports = { accessDeniedBlocks };
