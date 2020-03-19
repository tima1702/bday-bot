const dbApp = require('../../../db');
const api = require('../../api');
const uiBlocks = require('../../uiBlocks');

function add(view, channelId, userId) {
  const titleValue = view.state.values.feedbackTitle.actionFeedbackTitle.value || '';
  const urlValue = view.state.values.feedbackURL.actionFeedbackURL.value || '';
  const reviewValue = view.state.values.feedbackReview.actionFeedbackReview.value || '';
  const tagsValues = view.state.values.feedbackTags.actionFeedbackTags.selected_options.map((item) => item.value) || [];

  dbApp.feedback
    .add(userId, titleValue, urlValue, reviewValue, tagsValues)
    .then(() => api.chat.postEphemeral(channelId, userId, '', [uiBlocks.feedback.successAdded()]).catch(() => {}))
    .catch(() => api.chat.postEphemeral(channelId, userId, '', [uiBlocks.feedback.errorAdded()]).catch(() => {}));

  return {
    response_action: 'clear',
  };
}

function edit(view, channelId, userId, recordId) {
  return new Promise((resolve) => {
    const titleValue = view.state.values.feedbackTitle.actionFeedbackTitle.value || '';
    const urlValue = view.state.values.feedbackURL.actionFeedbackURL.value || '';
    const reviewValue = view.state.values.feedbackReview.actionFeedbackReview.value || '';
    const tagsValues =
      view.state.values.feedbackTags.actionFeedbackTags.selected_options.map((item) => Number(item.value)) || [];

    const response = () =>
      resolve({
        response_action: 'clear',
      });

    dbApp.feedback
      .edit(recordId, userId, titleValue, urlValue, reviewValue, tagsValues)
      .then(response)
      .catch(response);
  });
}

module.exports = { add, edit };
