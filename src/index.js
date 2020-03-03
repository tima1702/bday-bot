const slackServer = require('./slack');
const db = require('./db');

db.weather.updateAllWatcher(); // Update weather

slackServer.init();
