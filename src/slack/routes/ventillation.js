const express = require('express');
const uiBlocks = require('../uiBlocks');
const client = require('../client');
const router = express.Router();

function commandNotFound(command = '') {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Команда ${command ? `"${command}"` : ''} не найдена!*`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Доступные команды:',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '`add` - добавить время',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '`schedule` - получить расписание',
        },
      },
    ],
  };
}

router.post('/', function(req, res) {
  if (req.body && req.body.text) {
    switch (req.body.text) {
      case 'add':
        client.ventillation.openAddModal(req.body.channel_id, req.body.trigger_id);
        res.end();

        break;

      case 'schedule':
        uiBlocks.ventillation.list(req.body.channel_id).then((data) => res.json({ blocks: data }));
        break;

      default:
        res.json(commandNotFound(req.body.text));
        break;
    }
    return;
  }
  res.json(commandNotFound());
});

module.exports = router;
