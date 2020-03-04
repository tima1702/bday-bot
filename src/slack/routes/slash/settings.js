const express = require('express');
const uiBlocks = require('../../uiBlocks');
const client = require('../../client');
const router = express.Router();

router.post('/', function(req, res) {
  client.permission
    .checkAccess(req.body.channel_id, req.body.user_id)
    .then(() => {
      if (req.body && req.body.text) {
        switch (req.body.text) {
          case 'admin':
            client.ventillation.openAddModal(req.body.channel_id, req.body.trigger_id);
            res.end();
            break;

          case 'weather':
            client.settings.openChangeWeatherModal(req.body.channel_id, req.body.trigger_id);
            res.end();
            break;

          default:
            res.json(uiBlocks.notFound.commandNotFound('settings', req.body.text));
            break;
        }
        return;
      }
      res.json(uiBlocks.notFound.commandNotFound('settings'));
    })
    .catch((blocks) => res.json({ blocks }));
});

module.exports = router;
