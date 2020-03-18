const dbApp = require('../../../db');
const { WebClient } = require('@slack/web-api');
const env = require('../../../env');
const web = new WebClient(env.getSlackToken());
const uiBlock = require('../../uiBlocks');

function add(view, channelId, userId) {
  const tagValue = view.state.values.tagName.actionTagName.value || '';

  const completeTagName = tagValue
    .toLowerCase()
    .replace(/[\s]+/gm, ' ')
    .trim();

  dbApp.feedbackTags
    .add(completeTagName)
    .then(() => {
      web.chat.postEphemeral({
        channel: channelId,
        user: userId,
        text: '',
        blocks: [uiBlock.settings.tag.successAdded(completeTagName)],
      });
    })
    .catch((e) => {
      if (e === 'duplicate') {
        web.chat.postEphemeral({
          channel: channelId,
          user: userId,
          text: '',
          blocks: [uiBlock.settings.tag.errorAddedDuplicate(completeTagName)],
        });
        return;
      }

      web.chat.postEphemeral({
        channel: channelId,
        user: userId,
        text: '',
        blocks: [uiBlock.settings.tag.errorAdded(completeTagName)],
      });
    });

  return {
    response_action: 'clear',
  };
}

module.exports = { add };
