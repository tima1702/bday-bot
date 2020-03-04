const log4js = require('log4js');

log4js.configure({
  appenders: {
    database: { type: 'file', filename: 'log/app.log' },
    access: { type: 'file', filename: 'log/access.log' },
  },
  categories: { default: { appenders: ['database', 'access'], level: 'error' } },
});

function logDb() {
  const logger = log4js.getLogger('database');
  logger.level = 'debug';
  return logger;
}

function logAccess() {
  const logger = log4js.getLogger('access');
  logger.level = 'warn';
  return logger;
}

module.exports = { logDb, logAccess };
