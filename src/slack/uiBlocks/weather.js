const utils = require('../../utils');
const dbApp = require('../../db');

function get(city) {
  return new Promise((resolve, reject) => {
    dbApp.weather
      .get(city)
      .then((r) => {
        resolve({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `За окном:thermometer: ${r.temp} °C, ощущается как ${
              r.temp_feels_like
            } °C, :dash: *${utils.weather.degToCompass(r.wind_deg)}* ${r.wind_speed} м/c`,
          },
        });
      })
      .catch(() => {
        reject([]);
      });
  });
}

module.exports = { get };
