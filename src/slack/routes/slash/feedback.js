const express = require('express');
const env = require('../../../env');
const uiBlocks = require('../../uiBlocks');
const router = express.Router();
const client = require('../../client');

router.post('/list', function(req, res) {
  uiBlocks.feedback.getPage().then((blocks) => {
    res.json({ blocks });
  });
});

router.post('/add', function(req, res) {
  client.feedback.openAddModal(req.body.channel_id, req.body.trigger_id);

  res.end();
});

module.exports = router;
