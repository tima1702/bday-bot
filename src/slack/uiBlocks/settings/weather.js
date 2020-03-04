const db = require('../../db');

/**
 * Модальное окно для добавления / изменения города погоды в канале
 *
 * @param {String} channelId
 * @returns Promise
 */
function changeModal(channelId) {
  return new Promise((resolve) => {
    const modal = {
      type: 'modal',
      callback_id: `modal-settings-weather-change:${channelId}`,
      title: {
        type: 'plain_text',
        text: 'Изменение города погоды',
        emoji: true,
      },
      submit: {
        type: 'plain_text',
        text: 'Добавить / Изменить',
        emoji: true,
      },
      close: {
        type: 'plain_text',
        text: 'Отмена',
        emoji: true,
      },
      blocks: [
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
            emoji: true,
          },
        },
      ],
    };

    db.channels
      .getWeatherCity(channelId)
      .then((weather_city) => {
        if (weather_city)
          modal.blocks.unshift({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Текущий город:* ${weather_city}`,
            },
          });
        resolve(modal);
      })
      .catch(() => resolve(modal));
  });
}

module.exports = { changeModal };
