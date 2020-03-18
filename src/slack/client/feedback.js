const uiBlocks = require('../uiBlocks');
const api = require('../api');

function openAddModal(channelId, triggerId) {
  uiBlocks.feedback.addModal(channelId).then((view) => api.views.open(triggerId, view));
}

module.exports = { openAddModal };
