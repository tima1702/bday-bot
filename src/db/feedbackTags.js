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
  return Feedback_Tags.create({ name: name.toLowerCase() });
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

module.exports = { init, findTags, add, findByIds };
