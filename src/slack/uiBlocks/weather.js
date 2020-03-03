const utils = require('../../utils');
const dbApp = require('../../db');

function get(city) {
  return new Promise((resolve, reject) => {
    dbApp.weather.get(city).then((r) => {
      resolve({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `За окном:thermometer: ${r.temp} °C, ощущается как ${
            r.temp_feels_like
          } °C, :tornado_cloud: *${utils.weather.degToCompass(r.wind_deg)}* ${r.wind_speed} м/c${
            utils.date.printDate(r.last_update) ? `. _Обновлено ${utils.date.printDate(r.last_update)}_` : ''
          }`,
        },
      });
    });
  });
}

module.exports = { get };
