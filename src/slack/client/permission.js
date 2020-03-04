const uiBlocks = require('../uiBlocks');
const db = require('../db');

function checkAccess(channel_id, user_id) {
  return new Promise((resolve, reject) => {
    if (channel_id && user_id) {
      db.admins
        .checkAccess(channel_id, user_id)
        .then(() => resolve(true))
        .catch(() => {
          db.admins.list(channel_id).then((admins) => {
            reject([
              ...uiBlocks.permission.accessDeniedBlocks(),
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*Обратитесь за доступом к одному из администраторов:*',
                },
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: admins.map((userId) => `<@${userId}>`).join(' '),
                },
              },
            ]);
          });
        });
    }
  });
  reject(false);
}

module.exports = { checkAccess };
