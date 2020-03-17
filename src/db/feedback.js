const models = require('../models');
const utils = require('../utils');
const feedbackTags = require('./feedbackTags');

const Feedback = models.Feedback;

function init() {
  return Feedback.sync();
}

function add(slackUserId, title, url, message, tags = []) {
  return new Promise((resolve, reject) => {
    if ((!slackUserId, !title, !url, !message, !tags)) {
      reject('invalid data');
      return;
    }

    const divider = '|';
    const tagsString = tags && tags.length ? `${divider}${tags.join(divider)}${divider}` : [];

    Feedback.create({ slackUserId, title, url, message, tags: tagsString })
      .then(resolve)
      .catch(reject);
  });
}

function deleteById(id) {
  return new Promise((resolve) => {
    Feedback.destroy({ where: { id } })
      .then(() => resolve())
      .catch(() => resolve());
  });
}

function getPage(page = 0, user = '', tag = '') {
  return new Promise((resolve, reject) => {
    const pageSize = 3;

    const request = {
      where: {},
      limit: pageSize,
      offset: page * pageSize,
      order: [['id', 'DESC']],
    };

    if (user && tag) {
      request.where = {
        [models.Sequelize.Op.and]: {
          slackUserId: user,
          tags: {
            [models.Sequelize.Op.like]: `%|${tag}|%`,
          },
        },
      };
    } else {
      if (user) {
        request.where.slackUserId = user;
      }

      if (tag) {
        request.where.tags = {
          [models.Sequelize.Op.like]: `%|${tag}|%`,
        };
      }
    }

    Promise.all([
      Feedback.findAll(request).catch(() => null),
      Feedback.count({ where: request.where }).catch(() => null),
    ])
      .then((prom) => {
        const [records, count] = prom;
        let newRecords = [];

        const uniqTags = [];

        if (records && records.length) {
          records.forEach((record) => {
            const copyRecord = { ...record.dataValues };

            if (copyRecord.tags) {
              const tags = [];

              copyRecord.tags.split('|').forEach((tag) => {
                const num = Number(tag);
                if (tag && num) {
                  tags.push(num);
                  if (!uniqTags.includes(num)) uniqTags.push(num);
                }
              });

              newRecords.push({ ...copyRecord, tags });
            } else {
              newRecords.push({ ...copyRecord, tags: [] });
            }
          });
        }

        feedbackTags.findByIds(uniqTags).then((tags) => {
          const preparedTags = {};

          tags.forEach((tag) => (preparedTags[tag.id] = tag.name));

          const data = {
            records: newRecords.map((record) => {
              const data = { ...record, tags: record.tags.map((tag) => preparedTags[`${tag}`]) };
              data.date = utils.date.printDate(Math.floor(new Date(data.createdAt).getTime() / 1000), true);
              delete data.updatedAt;
              delete data.createdAt;

              return data;
            }),
            count,
          };

          resolve(data);
        });
      })
      .catch(reject);
  });
}

module.exports = { add, init, getPage, deleteById };
