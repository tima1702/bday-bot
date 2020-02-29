const { Sequelize } = require('sequelize');
const env = require('../env');
let path = '';

function getPath() {
  if (!path) {
    path = env.getAppDB();
  }

  return path;
}

const database = new Sequelize(getPath(), { logging: false });

function db() {
  return database;
}

function tran() {
  return database.transaction();
}

module.exports = { getPath, db, tran };
