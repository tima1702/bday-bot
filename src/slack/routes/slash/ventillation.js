const express = require('express');
const uiBlocks = require('../../uiBlocks');
const client = require('../../client');
const router = express.Router();

router.post('/add', function(req, res) {
  client.permission
    .checkAccess(req.body.channel_id, req.body.user_id)
    .then(() => {
      client.ventillation.openAddModal(req.body.channel_id, req.body.trigger_id);
      res.end();
    })
    .catch((blocks) => res.json({ blocks }));
});

router.post('/schedule', function(req, res) {
  uiBlocks.ventillation.list(req.body.channel_id, req.body.user_id).then((blocks) => res.json({ blocks }));
});

module.exports = router;
