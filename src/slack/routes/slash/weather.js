const express = require('express');
const uiBlocks = require('../../uiBlocks');
const client = require('../../client');
const { WebClient } = require('@slack/web-api');
const env = require('../../../env');
const db = require('../../db');
const web = new WebClient(env.getSlackToken());
const router = express.Router();

router.post('/', function(req, res) {
  db.channels.getWeatherCity(req.body.channel_id).then((weather_city) =>
    uiBlocks.weather
      .get(weather_city)
      .then((weatherBlock) => {
        web.chat.postEphemeral({
          channel: req.body.channel_id,
          user: req.body.user_id,
          text: '',
          blocks: [weatherBlock],
        });
      })
      .catch(() => {}),
  );

  res.end();
});

module.exports = router;
