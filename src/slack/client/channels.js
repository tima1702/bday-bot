const db = require('../db');
const { WebClient } = require('@slack/web-api');
const env = require('../../env');

function updateChannelsInfo() {
  const web = new WebClient(env.getSlackToken());

  web.channels.list().then((resp) => {
    if (resp && resp.ok && resp.channels && resp.channels.length) {
      resp.channels.map((item) => {
        db.channels.add(
          item.id || '',
          item.name || '',
          item.name_normalized || '',
          item.is_channel,
          item.creator || '',
          item.members || [],
        );

        db.admins.add(item.id || '', item.creator || '');
      });
    }
  });
}

module.exports = { updateChannelsInfo };
