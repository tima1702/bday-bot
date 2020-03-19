const uiBlocks = require('../uiBlocks');
const api = require('../api');
const dbApp = require('../../db');

function openAddModal(channelId, triggerId) {
  uiBlocks.feedback.addOrEditModal(channelId).then((view) => api.views.open(triggerId, view));
}

function openEditModal(channelId, triggerId, recordId, data) {
  dbApp.feedback.getById(recordId).then((record) => {
    if (record)
      uiBlocks.feedback
        .addOrEditModal(JSON.stringify({ channelId, recordId, data }), {
          feedbackTitle: record.title || '',
          feedbackURL: record.url || '',
          feedbackReview: record.message || '',
          feedbackTags:
            record.tags && record.tags.length
              ? record.tags.map(({ id, name }) => ({
                  text: {
                    type: 'plain_text',
                    text: name,
                  },
                  value: `${id}`,
                }))
              : [],
        })
        .then((view) => api.views.open(triggerId, view));
  });
}

module.exports = { openAddModal, openEditModal };
