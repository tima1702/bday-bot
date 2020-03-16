const { Model, DataTypes } = require('sequelize');
const config = require('./config');
const utils = require('../utils');

class Feedback extends Model {}

Feedback.init(
  {
    slackUserId: DataTypes.STRING,
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    message: DataTypes.STRING,
  },
  { sequelize: config.db(), modelName: 'feedback' },
);

function init() {
  return Feedback.sync();
}

function add(slackUserId, title, url, message, tags) {
  return new Promise((resolve, reject) => {
    if ((!slackUserId, !title, !url, !message)) {
      reject('invalid data');
      return;
    }

    Feedback.create({ slackUserId, title, url, message })
      .then(resolve)
      .catch(reject);
  });
}

function getPage(page = 0, user = '') {
  return new Promise((resolve, reject) => {
    const pageSize = 3;

    const request = {
      where: {},
      limit: pageSize,
      offset: page * pageSize,
      order: [['id', 'DESC']],
    };

    if (user) {
      request.where.slackUserId = user;
    }

    Promise.all([
      Feedback.findAll(request).catch(() => null),
      Feedback.count({ where: request.where }).catch(() => null),
    ])
      .then((prom) => {
        const [records, count] = prom;

        const data = {
          records: records.map((record) => {
            const data = { ...record.dataValues };
            data.date = utils.date.printDate(Math.floor(new Date(data.createdAt).getTime() / 1000), true);
            delete data.updatedAt;
            delete data.createdAt;

            return data;
          }),
          count,
        };

        resolve(data);
      })
      .catch(reject);
  });
}

module.exports = { add, init, getPage };
