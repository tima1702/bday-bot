const uiBlocks = require('../uiBlocks');
const dbApp = require('../../db');
const db = require('../db');
const { WebClient } = require('@slack/web-api');
const env = require('../../env');
const web = new WebClient(env.getSlackToken());

function openChangeWeatherModal(channel_id, trigger_id) {
  uiBlocks.settings.weather.changeModal(channel_id).then((view) => {
    web.views.open({ trigger_id, view });
  });
}

function changeWeatherCityInChannel(channelId, newWeatherCity) {
  return new Promise((resolve, reject) => {
    if (newWeatherCity) {
      dbApp.weather
        .add(newWeatherCity)
        .then((newCityName) => {
          db.channels
            .changeWeatherCity(channelId, newCityName)
            .then((resp) => {
              resolve(newCityName);
            })
            .catch((e) => reject(''));
        })
        .catch(() => reject('not_found'));
      return;
    }
    reject('');
  });
}

module.exports = {
  openChangeWeatherModal,
  changeWeatherCityInChannel,
};
