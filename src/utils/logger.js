const log4js = require('log4js');

log4js.configure({
  appenders: { database: { type: 'file', filename: 'app.log' } },
  categories: { default: { appenders: ['database'], level: 'error' } },
});

function logDb() {
  const logger = log4js.getLogger('database');
  logger.level = 'debug';
  return logger;
}

module.exports = { logDb };
