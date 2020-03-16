const dbApp = require('../../../db');

function add(view, channelId, userId) {
  const titleValue = view.state.values.feedbackTitle.actionFeedbackTitle.value || '';
  const urlValue = view.state.values.feedbackURL.actionFeedbackURL.value || '';
  const reviewValue = view.state.values.feedbackReview.actionFeedbackReview.value || '';
  const tagsValues = view.state.values.feedbackTags.actionFeedbackTags.selected_options.map((item) => item.value) || [];

  dbApp.feedback.add(userId, titleValue, urlValue, reviewValue, tagsValues);

  return {
    response_action: 'clear',
  };
}

module.exports = { add };
