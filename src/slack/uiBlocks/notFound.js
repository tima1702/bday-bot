const uiItems = require('../uiItems');

function commandNotFound(slash, command = '') {
  switch (slash) {
    case 'ventillation':
      return {
        blocks: [
          uiItems.text.markdownSection(`*Команда ${command ? `"${command}"` : ''} не найдена!*`),
          uiItems.text.markdownSection('Доступные команды:'),
          uiItems.text.markdownSection('*add* - добавить время'),
          uiItems.text.markdownSection('*schedule* - получить расписание'),
        ],
      };

    case 'settings':
      return {
        blocks: [
          uiItems.text.markdownSection(`*Команда ${command ? `"${command}"` : ''} не найдена!*`),
          uiItems.text.markdownSection('Доступные команды:'),
          uiItems.text.markdownSection('*weather* - добавить/изменить город погоды'),
          uiItems.text.markdownSection('*admin* - управление администраторами'),
        ],
      };

    default:
      return {
        blocks: [uiItems.text.markdownSection('Такой команды не существует!')],
      };
  }
}

module.exports = { commandNotFound };
