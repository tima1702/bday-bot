const utils = require('../../utils');
const dbApp = require('../../db');

function get(city) {
  return new Promise((resolve) => {
    dbApp.weather
      .get(city)
      .then((r) => {
        resolve({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `За окном :cityscape: ${r.city_name} :thermometer: ${r.temp} °C, ощущается как ${
              r.temp_feels_like
            } °C, :tornado_cloud: *${utils.weather.degToCompass(r.wind_deg)}* ${r.wind_speed} м/c${
              utils.date.printDate(r.last_update) ? `. _Обновлено ${utils.date.printDate(r.last_update)} по GMT_` : ''
            }`,
          },
        });
      })
      .catch(() =>
        resolve({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: ':thermometer:Для канала не найден город для запроса погоды!',
          },
        }),
      );
  });
}

module.exports = { get };
