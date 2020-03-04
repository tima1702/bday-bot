const client = require('../../client');
const { WebClient } = require('@slack/web-api');
const env = require('../../../env');
const web = new WebClient(env.getSlackToken());

function change(view, channelId, userId) {
  const newWeatherCity = view.state.values.changeWeatherCity.actionChangeWeatherCity.value || '';

  if (!newWeatherCity || !new RegExp('^[a-zA-Zа-яА-Я]+$').test(newWeatherCity)) {
    web.chat.postEphemeral({
      attachments: [],
      channel: channelId,
      user: userId,
      text: '',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Ошибка поиска города, к вводу разрешены только буквы*!`,
          },
        },
      ],
    });

    return;
  }

  client.settings
    .changeWeatherCityInChannel(channelId, newWeatherCity)
    .then((newCityName) => {
      web.chat.postEphemeral({
        attachments: [],
        channel: channelId,
        user: userId,
        text: '',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Город ${newCityName} успешно добавлен / изменен!*`,
            },
          },
        ],
      });
    })
    .catch((e) => {
      web.chat.postEphemeral({
        attachments: [],
        channel: channelId,
        user: userId,
        text: '',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Ошибка добавления / изменения города${e === 'not_found' ? ' ' + newWeatherCity : ''}!*`,
            },
          },
        ],
      });
    });

  return {
    response_action: 'clear',
  };
}

module.exports = { change };
