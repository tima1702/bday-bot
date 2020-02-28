const request = require('request');

function get() {
  const options = {
    method: 'GET',
    url: 'https://openweathermap.org/data/2.5/weather/?appid=b6907d289e10d714a6e88b30761fae22&id=518970&units=metric',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    request(options, function(error, response) {
      if (error) reject(error);
      resolve(response.body);
    });
  });
}

module.exports = { get };
