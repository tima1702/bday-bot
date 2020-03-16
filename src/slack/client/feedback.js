const env = require('../../env');
const uiBlocks = require('../uiBlocks');
const { WebClient } = require('@slack/web-api');
const web = new WebClient(env.getSlackToken());

function openAddModal(channelId, triggerId) {
  uiBlocks.feedback.addModal(channelId).then((view) => web.views.open({ trigger_id: triggerId, view }));
}

module.exports = { openAddModal };
