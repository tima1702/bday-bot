const envList = require('dotenv').config();

const env = {
  WEATHER_INTERVAL: (envList.parsed && envList.parsed.WEATHER_INTERVAL) * 60000 || 900000,
  WEATHER_API_TOKEN: (envList.parsed && envList.parsed.WEATHER_API_TOKEN) || 'b6907d289e10d714a6e88b30761fae22',
  SLACK_API_TOKEN: (envList.parsed && envList.parsed.SLACK_API_TOKEN) || '',
  APP_DB: (envList.parsed && envList.parsed.APP_DB) || 'dbs/app_database.sqlite3',
  SLACK_EVENT_SERVER_PORT: +(envList.parsed && envList.parsed.SLACK_EVENT_SERVER_PORT) || 3003,
  SLACK_EVENT_SERVER_SECRET: +(envList.parsed && envList.parsed.SLACK_EVENT_SERVER_SECRET) || 'super_secret',
  IS_DEBUG: +(envList.parsed && envList.parsed.DEBUG) || false,
};

function getSlackToken() {
  return env.SLACK_API_TOKEN;
}

function isDebug() {
  return env.IS_DEBUG;
}

function getAppDB() {
  return env.APP_DB;
}

function getWeatherInterval() {
  return env.WEATHER_INTERVAL;
}

function getSlackEventServerPort() {
  return env.SLACK_EVENT_SERVER_PORT;
}

function getSlackEventServerSecret() {
  return env.SLACK_EVENT_SERVER_SECRET;
}

function getWeatherApiToken() {
  return env.WEATHER_API_TOKEN;
}

module.exports = {
  getSlackToken,
  getAppDB,
  getSlackEventServerPort,
  getSlackEventServerSecret,
  getWeatherInterval,
  getWeatherApiToken,
  isDebug,
};
