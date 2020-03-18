const db = require('../db');
const api = require('../api');

function updateChannelsInfo() {
  api.channels
    .list()
    .then((resp) => {
      if (resp && resp.ok && resp.channels && resp.channels.length) {
        resp.channels.map((item) => {
          db.channels
            .add(
              item.id || '',
              item.name || '',
              item.name_normalized || '',
              item.is_channel,
              item.creator || '',
              item.members || [],
            )
            .then(() => {})
            .catch(() => {});

          db.admins
            .add(item.id || '', item.creator || '')
            .then(() => {})
            .catch(() => {});
        });
      }
    })
    .catch(() => {});
}

module.exports = { updateChannelsInfo };
