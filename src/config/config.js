const env = require('../env');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: 'dbs/app_database.sqlite3',
    logging: env.isDebug(),
  },
  test: {
    dialect: 'sqlite',
    storage: 'dbs/app_database.sqlite3',
    logging: env.isDebug(),
  },
  production: {
    dialect: 'sqlite',
    storage: 'dbs/app_database.sqlite3',
    logging: env.isDebug(),
  },
};
