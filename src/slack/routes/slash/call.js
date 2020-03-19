const express = require('express');
const uiBlocks = require('../../uiBlocks');
const api = require('../../api');
const router = express.Router();

router.post('/start', function(req, res) {
  api.chat
    .postMessage(req.body.channel_id, 'Начался созвон!', [uiBlocks.call.start(req.body.user_id)])
    .catch(() => api.chat.postMessage(req.body.user_id, 'Ошибка отправки оповещения в канал!'));
  res.end();
});

router.post('/remind', function(req, res) {
  api.chat
    .postMessage(req.body.channel_id, 'Напоминание что идет созвон!', [uiBlocks.call.remind(req.body.user_id)])
    .catch(() => api.chat.postMessage(req.body.user_id, 'Ошибка отправки оповещения в канал!'));
  res.end();
});

router.post('/stop', function(req, res) {
  api.chat
    .postMessage(req.body.channel_id, 'Созвон завершен!', [uiBlocks.call.stop(req.body.user_id)])
    .catch(() => api.chat.postMessage(req.body.user_id, 'Ошибка отправки оповещения в канал!'));
  res.end();
});

module.exports = router;
