const express = require('express');
const { WebClient } = require('@slack/web-api');
const env = require('../../../env');
const router = express.Router();
const web = new WebClient(env.getSlackToken());

const uiBlocks = require('../../uiBlocks');

router.post('/list', function(req, res) {
  uiBlocks.feedback.getPage().then((blocks) => {
    res.json({ blocks });
  });
});

router.post('/add', function(req, res) {
  web.views
    .open({
      trigger_id: req.body.trigger_id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: 'Добавление отзыва',
          emoji: true,
        },
        submit: {
          type: 'plain_text',
          text: 'Submit',
          emoji: true,
        },
        close: {
          type: 'plain_text',
          text: 'Cancel',
          emoji: true,
        },
        blocks: [
          {
            type: 'input',
            element: {
              type: 'plain_text_input',
              placeholder: {
                type: 'plain_text',
                text: 'Введите название',
                emoji: true,
              },
            },
            label: {
              type: 'plain_text',
              text: 'Название',
              emoji: true,
            },
          },
          {
            type: 'input',
            element: {
              type: 'plain_text_input',
              placeholder: {
                type: 'plain_text',
                text: 'Введите URL статьи / видео',
                emoji: true,
              },
            },
            label: {
              type: 'plain_text',
              text: 'URL',
              emoji: true,
            },
          },
          {
            type: 'input',
            element: {
              type: 'plain_text_input',
              multiline: true,
              placeholder: {
                type: 'plain_text',
                text: 'Напишите отзыв',
                emoji: true,
              },
            },
            label: {
              type: 'plain_text',
              text: 'Отзыв',
              emoji: true,
            },
          },
          {
            type: 'input',
            element: {
              type: 'multi_channels_select',
              placeholder: {
                type: 'plain_text',
                text: 'Выберите теги',
                emoji: true,
              },
            },
            label: {
              type: 'plain_text',
              text: 'Теги',
              emoji: true,
            },
          },
        ],
      },
    })
    .then((r) => console.log('THEN: ', r))
    .then((r) => console.log('CATCH: ', r));

  res.end();
});

module.exports = router;
