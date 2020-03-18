const dbApp = require('../../../db');
const uiBlock = require('../../uiBlocks');
const api = require('../../api');

function add(view, channelId, userId) {
  const tagValue = view.state.values.tagName.actionTagName.value || '';

  const completeTagName = tagValue
    .toLowerCase()
    .replace(/[\s]+/gm, ' ')
    .trim();

  dbApp.feedbackTags
    .add(completeTagName)
    .then(() => {
      api.chat.postEphemeral(channelId, userId, '', [uiBlock.settings.tag.successAdded(completeTagName)]);
    })
    .catch((e) => {
      if (e === 'duplicate') {
        api.chat.postEphemeral(channelId, userId, '', [uiBlock.settings.tag.errorAddedDuplicate(completeTagName)]);
        return;
      }

      api.chat.postEphemeral(channelId, userId, '', [uiBlock.settings.tag.errorAdded(completeTagName)]);
    });

  return {
    response_action: 'clear',
  };
}

module.exports = { add };
