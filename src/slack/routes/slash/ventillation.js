const express = require('express');
const uiBlocks = require('../../uiBlocks');
const client = require('../../client');
const router = express.Router();

router.post('/', function(req, res) {
  if (req.body && req.body.text) {
    switch (req.body.text) {
      case 'add':
        client.permission
          .checkAccess(req.body.channel_id, req.body.user_id)
          .then(() => {
            client.ventillation.openAddModal(req.body.channel_id, req.body.trigger_id);
            res.end();
          })
          .catch((blocks) => res.json({ blocks }));

        break;

      case 'schedule':
        uiBlocks.ventillation.list(req.body.channel_id, req.body.user_id).then((blocks) => res.json({ blocks }));
        break;

      default:
        res.json(uiBlocks.notFound.commandNotFound('ventillation', req.body.text));
        break;
    }
    return;
  }
  res.json(uiBlocks.notFound.commandNotFound('ventillation'));
});

module.exports = router;
