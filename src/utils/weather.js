const request = require('request');
const env = require('../env');
const utilsDate = require('./date');

function get(cityName = '') {
  const options = {
    method: 'GET',
    url: `https://openweathermap.org/data/2.5/weather/?appid=${env.getWeatherApiToken()}&q=${encodeURIComponent(
      cityName,
    )}&units=metric`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    request(options, function(error, response) {
      if (error) reject(error);
      const data = (response && response.body && JSON.parse(response.body)) || {};
      if (data && data.cod) {
        if (data.cod === 200) {
          const { name, main, wind, dt } = data;

          const newData = {};

          if (name) newData.city_name = name;
          if (main) {
            if (main.temp) newData.temp = main.temp;
            if (main.feels_like) newData.temp_feels_like = main.feels_like;
          }
          if (wind) {
            if (wind.speed) newData.wind_speed = wind.speed;
            if (wind.deg) newData.wind_deg = wind.deg;
          }
          if (dt) newData.dt = dt;

          if (newData) {
            newData.last_update = Math.floor(utilsDate.getCurrentDate().getTime() / 1000);
            resolve(newData);
          }

          reject('Error parse data weather');
        }
        reject(data.message);
      }

      resolve('Error parse data');
    });
  });
}

function degToCompass(deg) {
  const value = Math.floor(deg / 22.5 + 0.5);
  const arr = ['С', 'ССВ', 'СВ', 'ВВС', 'В', 'ВЮВ', 'ЮВ', 'ЮЮВ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ'];
  return arr[value % 16];
}

module.exports = { get, degToCompass };
