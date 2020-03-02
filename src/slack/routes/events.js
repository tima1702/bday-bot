const express = require('express');
const uiBlocks = require('../uiBlocks');
const client = require('../client');
const router = express.Router();

router.post('/', function(req, res) {
  console.log('Events', req.body);
  if (req.body) {
    if (req.body.challenge) {
      res.json({ challenge: req.body.challenge });
      return;
    }

    res.json({ text: 'ASDFGHJ' });
  }
  res.end();
});

module.exports = router;
