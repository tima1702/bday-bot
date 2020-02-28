const express = require('express');

const client = require('./client');
const routes = require('./routes');

const env = require('../env');

function startServer() {
  const app = express();

  app.use(express.json());
  app.use(express.text());
  app.use(express.urlencoded());

  app.use(function(req, res, next) {
    if (req.query.secret && req.query.secret === env.getSlackEventServerSecret()) {
      next();
    } else {
      res.status(403);
      res.end('Access Denied');
    }
  });

  app.use('/slack/slash/ventillation', routes.ventillation);

  app.listen(env.getSlackEventServerPort());
}

function init() {
  if (!process.env.SLACK_API_TOKEN) {
    console.error('Slack Token Not Found!');
    return;
  }
  client.channels.updateChannelsInfo();

  startServer();
  console.log('Slack Server is started');
  console.log('Port: ', env.getSlackEventServerPort());
}

module.exports = { init };
