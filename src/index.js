const slackServer = require('./slack');
const db = require('./db');
const env = require('./env');

// Update weather
db.weather.updateAll();
setInterval(() => {
  db.weather.updateAll();
}, env.getWeatherInterval());

slackServer.init();
