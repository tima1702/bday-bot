const uiItems = require('../../uiItems');

function successAdded(tagName) {
  return uiItems.text.markdownSection(`*Тег _${tagName}_ был успешно добавлен*`);
}

function errorAddedDuplicate(tagName) {
  return uiItems.text.markdownSection(`*Ошибка добавления тега _${tagName}_, он уже существует!*`);
}

function errorAdded(tagName) {
  return uiItems.text.markdownSection(`*Ошибка добавления тега _${tagName}_!*`);
}

/**
 * Модальное окно для добавления тега
 *
 * @param {String} channelId
 */
function addModal(channelId) {
  return uiItems.modal.create(
    'Добавление нового тега',
    `modal-settings-tag-add:${channelId}`,
    [
      uiItems.text.markdownSection(
        '*Внимание! Удалить или изменить тег будет невозможно!* _и он будет сохранен в нижнем регистре_',
      ),
      {
        type: 'input',
        block_id: 'tagName',
        element: {
          action_id: 'actionTagName',
          placeholder: {
            type: 'plain_text',
            text: 'Введите название',
          },
          type: 'plain_text_input',
        },
        label: {
          type: 'plain_text',
          text: 'Название',
        },
      },
    ],
    {},
    'Добавить',
  );
}

module.exports = { addModal, successAdded, errorAddedDuplicate, errorAdded };
