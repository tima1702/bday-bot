const models = require('../models');
const utils = require('../utils');
const feedbackTags = require('./feedbackTags');

const Feedback = models.Feedback;

function init() {
  return Feedback.sync();
}

const tagDivider = '|';

function parseTagString(str = '', uniqTagsInitial = []) {
  const tags = [];
  const uniqTags = [...uniqTagsInitial];
  if (str)
    str.split(tagDivider).forEach((tag) => {
      const num = Number(tag);
      if (tag && num) {
        tags.push(num);
        if (!uniqTags.includes(num)) uniqTags.push(num);
      }
    });

  return { tags, uniqTags };
}

function arrayTagToString(tags = []) {
  return tags && tags.length ? `${tagDivider}${tags.join(tagDivider)}${tagDivider}` : '';
}

function add(slackUserId, title, url, message, tags = []) {
  return new Promise((resolve, reject) => {
    if (!slackUserId || !title || !url || !message || !tags) return reject('invalid data');
    Feedback.create({ slackUserId, title, url, message, tags: arrayTagToString(tags) })
      .then(resolve)
      .catch(reject);
  });
}

function edit(recordId, slackUserId, title, url, message, tags = []) {
  return new Promise((resolve, reject) => {
    if (!recordId || !slackUserId || !title || !url || !message || !tags) return reject('invalid data');
    Feedback.update({ slackUserId, title, url, message, tags: arrayTagToString(tags) }, { where: { id: recordId } })
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

function getById(id) {
  return new Promise((resolve) => {
    Feedback.findOne({ where: { id } })
      .then((record) =>
        feedbackTags.findByIds(parseTagString(record.dataValues.tags).tags).then((records) =>
          resolve({
            ...record.dataValues,
            tags: records,
          }),
        ),
      )
      .catch(() => resolve({}));
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
            const parsedTags = parseTagString(record.dataValues.tags, uniqTags);

            uniqTags.push(...parsedTags.uniqTags);
            newRecords.push({ ...record.dataValues, tags: parsedTags.tags });
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

module.exports = { add, edit, init, getPage, deleteById, getById };
