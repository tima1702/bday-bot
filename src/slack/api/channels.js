const { WebClient } = require('@slack/web-api');
const env = require('../../env');
const web = new WebClient(env.getSlackToken());

function list() {
  // TODO: This method is deprecated! Fix this

  return web.channels.list();
}

module.exports = { list };
