const uiBlocks = require('../uiBlocks');
const uiItems = require('../uiItems');
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
              uiItems.text.markdownSection('*Обратитесь за доступом к одному из администраторов:*'),
              uiItems.text.markdownSection(admins.map((userId) => `<@${userId}>`).join(' ')),
            ]);
          });
        });
    } else {
      reject(false);
    }
  });
}

module.exports = { checkAccess };
