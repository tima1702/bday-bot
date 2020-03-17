const dbApp = require('../../../db');

/**
 * Модальное окно для добавления тега
 *
 * @param {String} channelId
 */
function addModal(channelId) {
  return {
    type: 'modal',
    callback_id: `modal-settings-tag-add:${channelId}`,
    title: {
      type: 'plain_text',
      text: 'Добавление нового тега',
    },
    submit: {
      type: 'plain_text',
      text: 'Добавить',
    },
    close: {
      type: 'plain_text',
      text: 'Отмена',
    },
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Внимание! Удалить или изменить тег будет невозможно!* _и он будет сохранен в нижнем регистре_',
        },
      },
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
  };
}

module.exports = { addModal };
