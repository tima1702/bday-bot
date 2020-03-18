const { WebClient } = require('@slack/web-api');
const env = require('../../env');
const web = new WebClient(env.getSlackToken());

function postEphemeral(channelId, userId, text = '', blocks = [], attr = {}) {
  return web.chat.postEphemeral({
    channel: channelId,
    user: userId,
    text,
    blocks,
    ...attr,
  });
}

function postMessage(channelId, text = '', blocks = [], attr = {}) {
  return web.chat.postMessage({
    channel: channelId,
    text,
    blocks,
    ...attr,
  });
}

function scheduleMessage(channelId, postAt, text = '', blocks = [], attr = {}) {
  return web.chat.scheduleMessage({
    channel: channelId,
    post_at: postAt,
    text,
    blocks,
    ...attr,
  });
}

function update(channelId, ts, text = '', blocks = [], attr = {}) {
  return web.chat.update({ channel_id: channelId, ts, text, blocks, ...attr });
}

module.exports = { postEphemeral, postMessage, scheduleMessage, update };
