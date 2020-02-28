const express = require('express');
const utils = require('../../utils');
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
        Promise.all([utils.weather.get()]).then((values) => {
          const resp = {
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*Событие добавления*',
                },
              },
            ],
          };

          const weather = JSON.parse(values[0]);

          if (weather.main && weather.main.temp) {
            resp.blocks.push({
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `Температура: ${weather.main.temp}`,
              },
            });
          }

          if (weather.wind && weather.wind.speed) {
            resp.blocks.push({
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `Скорость ветра: ${weather.wind.speed} м/c`,
              },
            });
          }

          res.json(resp);
        });

        break;

      case 'schedule':
        res.json({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*Событие получения списка*',
              },
            },
          ],
        });
        break;

      case 'test':
        res.json({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  '*Farmhouse Thai Cuisine*\n:star::star::star::star: 1528 reviews\n They do have some vegan options, like the roti and curry, plus they have a ton of salad stuff and noodles can be ordered without meat!! They have something for everyone here',
              },
              accessory: {
                type: 'image',
                image_url: 'https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg',
                alt_text: 'alt text for image',
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  '*Kin Khao*\n:star::star::star::star: 1638 reviews\n The sticky rice also goes wonderfully with the caramelized pork belly, which is absolutely melt-in-your-mouth and so soft.',
              },
              accessory: {
                type: 'image',
                image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg',
                alt_text: 'alt text for image',
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  '*Ler Ros*\n:star::star::star::star: 2082 reviews\n I would really recommend the  Yum Koh Moo Yang - Spicy lime dressing and roasted quick marinated pork shoulder, basil leaves, chili & rice powder.',
              },
              accessory: {
                type: 'image',
                image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/DawwNigKJ2ckPeDeDM7jAg/o.jpg',
                alt_text: 'alt text for image',
              },
            },
            {
              type: 'divider',
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Farmhouse',
                    emoji: true,
                  },
                  value: 'click_me_123',
                },
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Kin Khao',
                    emoji: true,
                  },
                  value: 'click_me_123',
                },
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Ler Ros',
                    emoji: true,
                  },
                  value: 'click_me_123',
                },
              ],
            },
            {
              type: 'section',
              text: {
                type: 'plain_text',
                text: 'This is a plain text section block.',
                emoji: true,
              },
            },
            {
              type: 'section',
              text: {
                type: 'plain_text',
                text: 'This is a plain text section block.',
                emoji: true,
              },
            },
            {
              type: 'image',
              title: {
                type: 'plain_text',
                text: 'image1',
                emoji: true,
              },
              image_url: 'https://api.slack.com/img/blocks/bkb_template_images/beagle.png',
              alt_text: 'image1',
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  'This is a mrkdwn section block :ghost: *this is bold*, and ~this is crossed out~, and <https://google.com|this is a link>',
              },
            },
          ],
        });
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
