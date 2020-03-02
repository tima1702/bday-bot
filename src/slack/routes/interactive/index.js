const express = require('express');
const uiBlocks = require('../../uiBlocks');
const client = require('../../client');
const actionVentillation = require('./ventillation');
const router = express.Router();

router.post('/', function(req, res) {
  if (req.body) {
    if (req.body.challenge) {
      res.json({ challenge: req.body.challenge });
      return;
    }

    if (req.body.payload) {
      const view = JSON.parse(req.body.payload).view || {};
      const userId = JSON.parse(req.body.payload).user.id || '';
      const [callbackType, channelId] = view.callback_id.split(':') || ['', ''];
      switch (callbackType) {
        case 'modal-ventillation-add':
          res.json(actionVentillation.add(view, channelId, userId));
          return;

        default:
          res.json({
            response_action: 'errors',
          });
          break;
      }
    }
  }
  res.end();
});

module.exports = router;
