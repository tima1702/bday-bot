const { Model, DataTypes } = require('sequelize');
const config = require('./config');
const utils = require('../../utils');

class Admins extends Model {}
Admins.init(
  {
    channel_id: DataTypes.STRING,
    admin_id: DataTypes.STRING,
  },
  { sequelize: config.db(), modelName: 'admins' },
);

function init() {
  return Admins.sync();
}

/**
 *
 *
 * @param {string} channel_id
 * @param {string} admin_id
 * @returns {Promise}
 */
function add(channel_id, admin_id) {
  return new Promise((resolve, reject) => {
    if (!channel_id || !admin_id) {
      reject('invalid data');
      return;
    }

    Admins.count({ where: { channel_id, admin_id } }).then((count) => {
      if (count !== 0) {
        reject('Author already exists');
      } else {
        Admins.create({
          channel_id,
          admin_id,
        })
          .then(() => {
            resolve();
          })
          .catch((e) => reject(e));
      }
    });
  });
}

function list(channel_id) {
  return new Promise((resolve) => {
    Admins.findAll({ where: { channel_id } })
      .then((records) => resolve(records.map((item) => item.toJSON().admin_id)))
      .catch((e) => resolve([]));
  });
}

function remove(channel_id, admin_id) {
  return Admins.destroy({ where: { channel_id, admin_id } });
}

function checkAccess(channel_id, admin_id) {
  return new Promise((resolve, reject) => {
    Admins.count({ where: { channel_id, admin_id } })
      .then((count) => {
        if (count && count !== 0) resolve(true);
        reject(false);

        utils.logger.logAccess().warn(`The user ${admin_id} is not allowed to access the management functionality`);
      })
      .catch(() => {
        reject(false);
        utils.logger.logAccess().warn(`The user ${admin_id} is not allowed to access the management functionality`);
      });
  });
}

module.exports = { add, list, checkAccess, remove, init };
