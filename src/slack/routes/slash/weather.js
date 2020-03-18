const express = require('express');
const uiBlocks = require('../../uiBlocks');
const db = require('../../db');
const router = express.Router();
const api = require('../../api');

router.post('/', function(req, res) {
  db.channels.getWeatherCity(req.body.channel_id).then((weather_city) =>
    uiBlocks.weather
      .get(weather_city)
      .then((weatherBlock) => {
        api.chat.postEphemeral(req.body.channel_id, req.body.user_id, '', [weatherBlock]);
      })
      .catch(() => {}),
  );

  res.end();
});

module.exports = router;
