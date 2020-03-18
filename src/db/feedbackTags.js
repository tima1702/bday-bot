const models = require('../models');

const Feedback_Tags = models.Feedback_Tags;

function init() {
  return Feedback_Tags.sync();
}

function findByIds(ids = []) {
  return new Promise((resolve) => {
    Feedback_Tags.findAll({
      where: { id: { [models.Sequelize.Op.or]: ids } },
      attributes: ['id', 'name'],
    })
      .then((records) => resolve(records.map((record) => record.dataValues)))
      .catch(() => resolve([]));
  });
}

function add(name) {
  return new Promise((resolve, reject) => {
    Feedback_Tags.count({ where: { name } })
      .then((count) => {
        console.log('..........count', count);

        if (count !== 0) {
          reject('duplicate');
          return;
        }
        Feedback_Tags.create({ name })
          .then(() => resolve())
          .catch(() => reject('error'));
      })
      .catch(() => reject('error'));
  });
}

function findTags(tagName) {
  return new Promise((resolve) => {
    Feedback_Tags.findAll({
      where: {
        name: { [models.Sequelize.Op.substring]: tagName.toLowerCase() || '' },
      },
      attributes: ['id', 'name'],
    })
      .then((records) => resolve(records.map((record) => record.dataValues)))
      .catch(() => resolve([]));
  });
}

function getNameById(id = 0) {
  return new Promise((resolve) => {
    if (id) {
      Feedback_Tags.findOne({
        where: { id },
        attributes: ['name'],
      })
        .then((record) => resolve(record.dataValues.name || 'not_found'))
        .catch(() => resolve('not_found'));
    } else {
      resolve('not_found');
    }
  });
}

module.exports = { init, findTags, add, findByIds, getNameById };
