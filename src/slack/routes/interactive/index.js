const express = require('express');
const uiBlocks = require('../../uiBlocks');
const axios = require('axios');
const db = require('../../db');
const actionVentillation = require('./ventillation');
const router = express.Router();

router.post('/', function(req, res) {
  if (req.body) {
    if (req.body.challenge) {
      res.json({ challenge: req.body.challenge });
      return;
    }

    if (req.body.payload) {
      const payload = JSON.parse(req.body.payload);
      const view = payload.view || {};


      const userId = JSON.parse(req.body.payload).user.id || '';

      if (payload.type === 'block_actions') {
        payload.actions.forEach((item) => {
          const [actionType, channelId] = (item.action_id && item.action_id.split(':')) || ['', '', ''];

          switch (actionType) {
            case 'remove_ventillation':
              db.ventillation
                .remove(JSON.parse(item.value).record_id)
                .then(() => {
                  uiBlocks.ventillation.list(channelId).then((blocks) =>
                    axios.post(payload.response_url, {
                      replace_original: 'true',
                      blocks,
                    }),
                  );
                })
                .catch(() => {});

              break;

            default:
              res.json({
                response_action: 'errors',
              });
              break;
          }
        });
      } else {
        const [callbackType, channelId] = (view.callback_id && view.callback_id.split(':')) || ['', ''];
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
  }
  res.end();
});

module.exports = router;
