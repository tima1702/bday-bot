const db = require('../../db');
const uiItems = require('../../uiItems');

/**
 * Модальное окно для добавления / изменения города погоды в канале
 *
 * @param {String} channelId
 * @returns Promise
 */
function changeModal(channelId) {
  return new Promise((resolve) => {
    const modal = uiItems.modal.create(
      'Изменение города погоды',
      `modal-settings-weather-change:${channelId}`,
      [
        {
          type: 'input',
          block_id: 'changeWeatherCity',
          element: {
            placeholder: {
              type: 'plain_text',
              text: 'Введите название города',
            },
            type: 'plain_text_input',
            action_id: 'actionChangeWeatherCity',
          },
          label: {
            type: 'plain_text',
            text: 'Город',
          },
        },
      ],
      {},
      'Добавить / Изменить',
    );

    db.channels
      .getWeatherCity(channelId)
      .then((weather_city) => {
        if (weather_city) modal.blocks.unshift(uiItems.text.markdownSection(`*Текущий город:* ${weather_city}`));
        resolve(modal);
      })
      .catch(() => resolve(modal));
  });
}

module.exports = { changeModal };
