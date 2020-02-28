const { Sequelize } = require('sequelize');
const env = require('../../env');
let path = '';
const database = new Sequelize(getPath(), { logging: false });

function getPath() {
  if (!path) {
    path = env.getSlackDB();
  }

  return path;
}

function db() {
  return database;
}

function tran() {
  return database.transaction();
}

module.exports = { getPath, db, tran };
