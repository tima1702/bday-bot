const express = require('express');
const uiBlocks = require('../../uiBlocks');
const client = require('../../client');
const router = express.Router();

router.post('/weather', function(req, res) {
  client.permission
    .checkAccess(req.body.channel_id, req.body.user_id)
    .then(() => {
      client.settings.openChangeWeatherModal(req.body.channel_id, req.body.trigger_id);
      res.end();
    })
    .catch((blocks) => res.json({ blocks }));
});

router.post('/admin', function(req, res) {
  client.permission
    .checkAccess(req.body.channel_id, req.body.user_id)
    .then(() => {
      uiBlocks.settings.admins.manageList(req.body.channel_id, req.body.user_id).then((blocks) => res.json({ blocks }));
    })
    .catch((blocks) => res.json({ blocks }));
});

router.post('/tag_add', function(req, res) {
  client.permission
    .checkAccess(req.body.channel_id, req.body.user_id)
    .then(() => {
      client.settings.openAddTagModal(req.body.channel_id, req.body.trigger_id);
      res.end();
    })
    .catch((blocks) => res.json({ blocks }));
});

module.exports = router;
