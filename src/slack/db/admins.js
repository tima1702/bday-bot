const { Model, DataTypes } = require('sequelize');
const config = require('./config');

class Admins extends Model {}
Admins.init(
  {
    channel_id: DataTypes.STRING,
    admin_id: DataTypes.STRING,
  },
  { sequelize: config.db(), modelName: 'admins' },
);

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

    Admins.sync().then(() => {
      Admins.count({ where: { channel_id } }).then((count) => {
        if (count != 0) {
          reject('Author already exists');
        } else {
          Admins.sync()
            .then(() =>
              Admins.create({
                channel_id,
                admin_id,
              }),
            )
            .then(() => {
              resolve();
            })
            .catch((e) => reject(e));
        }
      });
    });
  });
}

module.exports = { add };
