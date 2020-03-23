const express = require('express');

const client = require('./client');
const routes = require('./routes');
const db = require('./db');

const env = require('../env');

function startServer() {
  const app = express();

  app.use(express.json());
  app.use(express.text());
  app.use(express.urlencoded());

  app.use('/system', routes.system);

  app.use(function(req, res, next) {
    if (req.query.secret && req.query.secret === env.getSlackEventServerSecret()) {
      next();
    } else {
      res.status(403);
      res.end('Access Denied');
    }
  });

  app.use('/slack/slash/ventillation', routes.slash.ventillation);
  app.use('/slack/slash/settings', routes.slash.settings);
  app.use('/slack/slash/call', routes.slash.call);
  app.use('/slack/slash/weather', routes.slash.weather);
  app.use('/slack/slash/feedback', routes.slash.feedback);

  app.use('/slack/events', routes.events);

  app.use('/slack/interactive', routes.interactive);

  app.listen(env.getSlackEventServerPort());
}

function init() {
  if (!process.env.SLACK_API_TOKEN) {
    console.error('Slack Token Not Found!');
    return;
  }
  client.channels.updateChannelsInfo();

  client.ventillation.checkScheduleAndSendMessageWatcher();
  db.init();
  startServer();
  console.log('Slack Server is started');
  console.log('Port: ', env.getSlackEventServerPort());
}

module.exports = { init };
