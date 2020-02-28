const envList = require('dotenv').config();

const env = {
  SLACK_API_TOKEN: (envList.parsed && envList.parsed.SLACK_API_TOKEN) || '',
  SLACK_DB: (envList.parsed && envList.parsed.SLACK_DB) || 'sqlite:./slack_database.db',
  SLACK_EVENT_SERVER_PORT: +(envList.parsed && envList.parsed.SLACK_EVENT_SERVER_PORT) || 3003,
  SLACK_EVENT_SERVER_SECRET: +(envList.parsed && envList.parsed.SLACK_EVENT_SERVER_SECRET) || 'super_secret',
};

function getSlackToken() {
  return env.SLACK_API_TOKEN;
}

function getSlackDB() {
  return env.SLACK_DB;
}

function getSlackEventServerPort() {
  return env.SLACK_EVENT_SERVER_PORT;
}

function getSlackEventServerSecret() {
  return env.SLACK_EVENT_SERVER_SECRET;
}

module.exports = { getSlackToken, getSlackDB, getSlackEventServerPort, getSlackEventServerSecret };
