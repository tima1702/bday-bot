const { WebClient } = require('@slack/web-api');
const env = require('../../env');
const web = new WebClient(env.getSlackToken());

function open(triggerId, view = {}, attr = {}) {
  return web.views.open({ trigger_id: triggerId, view, ...attr });
}

module.exports = { open };
