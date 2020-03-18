const client = require('../../client');
const api = require('../../api');
const uiItems = require('../../uiItems');

function change(view, channelId, userId) {
  const newWeatherCity = view.state.values.changeWeatherCity.actionChangeWeatherCity.value || '';

  if (!newWeatherCity || !new RegExp('^[a-zA-Zа-яА-Я]+$').test(newWeatherCity)) {
    api.chat.postEphemeral(channelId, userId, '', [
      uiItems.text.markdownSection('*Ошибка поиска города, к вводу разрешены только буквы*!'),
    ]);
    return;
  }

  client.settings
    .changeWeatherCityInChannel(channelId, newWeatherCity)
    .then((newCityName) => {
      api.chat.postEphemeral(channelId, userId, '', [
        uiItems.text.markdownSection(`*Город ${newCityName} успешно добавлен / изменен!*`),
      ]);
    })
    .catch((e) =>
      api.chat.postEphemeral(channelId, userId, '', [
        uiItems.text.markdownSection(
          `*Ошибка добавления / изменения города${e === 'not_found' ? ' ' + newWeatherCity : ''}!*`,
        ),
      ]),
    );

  return {
    response_action: 'clear',
  };
}

module.exports = { change };
