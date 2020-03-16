const utils = require('../../utils');
const dbApp = require('../../db');

function addModal(channelId) {
  return new Promise((resolve) =>
    resolve({
      callback_id: `modal-feedback-add:${channelId}`,
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
          block_id: 'feedbackTitle',
          element: {
            action_id: 'actionFeedbackTitle',
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
          block_id: 'feedbackURL',
          element: {
            action_id: 'actionFeedbackURL',
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
          block_id: 'feedbackReview',
          element: {
            action_id: 'actionFeedbackReview',
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
          block_id: 'feedbackTags',
          element: {
            action_id: 'actionFeedbackTags',
            type: 'multi_static_select',
            placeholder: {
              type: 'plain_text',
              text: 'Выберите теги',
            },
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: '*this is plain_text text*',
                },
                value: 'value-0',
              },
              {
                text: {
                  type: 'plain_text',
                  text: '*this is plain_text text*',
                },
                value: 'value-1',
              },
              {
                text: {
                  type: 'plain_text',
                  text: '*this is plain_text text*',
                },
                value: 'value-2',
              },
            ],
          },
          label: {
            type: 'plain_text',
            text: 'Теги',
          },
        },
      ],
    }),
  );
}

function getPage(page = 0, user = '') {
  return new Promise((resolve) => {
    dbApp.feedback
      .getPage(page, user)
      .then(({ records, count, distinct }) => {
        const blocks = [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Отзывы*',
            },
          },
          {
            type: 'divider',
          },
        ];

        if (count > 0) {
          records.forEach((record) => {
            blocks.push(
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*${record.title}* ${record.url ? `<${record.url}|Открыть статью>` : '_URL не указан_'}`,
                },
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `${record.slackUserId ? `<@${record.slackUserId}>` : ''} ${record.message || ''}`,
                },
              },
              {
                type: 'context',
                elements: [
                  {
                    type: 'mrkdwn',
                    text: `*ID:* ${record.id} | *Теги:* JS, WEB | *Дата:* _${record.date} по GMT_`,
                  },
                ],
              },
              {
                type: 'divider',
              },
            );
          });

          blocks.push(
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: `Всего отзывов: ${count} | Текущая страница: ${page + 1}`,
                },
              ],
            },
            { type: 'divider' },
          );
        } else {
          blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Пользователь <@${user}> еще не оставлял отзывов.*`,
            },
          });
        }

        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Выберите пользователя',
          },
          accessory: {
            type: 'users_select',
            action_id: `userPageInFeedBack:${JSON.stringify({ page })}`,
            placeholder: {
              type: 'plain_text',
              text: 'Все',
              emoji: true,
            },
          },
        });

        if (user) {
          blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Установлены фильтры:*',
            },
          });

          if (user) {
            blocks.push({
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `Выбран пользователь <@${user}>`,
              },
            });
          }

          blocks.push({
            type: 'actions',
            block_id: 'clearfiltersPageInFeedBack:',
            elements: [
              {
                style: 'danger',
                type: 'button',
                text: { type: 'plain_text', text: 'Сбросить фильтры' },
                value: 'cancel',
                action_id: 'clearFiltersPageInFeedBack:{}',
              },
            ],
          });
        }

        if (count > 3) {
          const countPages = Math.ceil(count / 3);

          const buttons = [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*Навигация:*',
              },
            },
            {
              type: 'actions',
              block_id: `changePageInFeedBack:`,
              elements: [],
            },
          ];

          if (page > 0) {
            buttons[1].elements.push(
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'На первую',
                },
                value: 'cancel',
                action_id: `nextPageInFeedBack:${JSON.stringify({ page: 0, user, first: true })}`,
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '<<< Сюда',
                },
                value: 'cancel',
                action_id: `nextPageInFeedBack:${JSON.stringify({ page: page - 1, user })}`,
              },
            );
          }

          if (page + 1 < countPages) {
            buttons[1].elements.push({
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Туда >>>',
              },
              value: 'cancel',
              action_id: `nextPageInFeedBack:${JSON.stringify({ page: page + 1, user })}`,
            });

            buttons[1].elements.push({
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'На последнюю',
              },
              value: 'cancel',
              action_id: `nextPageInFeedBack:${JSON.stringify({ page: countPages - 1, user, last: true })}`,
            });
          }

          blocks.push(
            {
              type: 'divider',
            },
            ...buttons,
          );
        }

        console.log('BYTES: ', utils.byteCount.string(JSON.stringify({ blocks })));

        resolve(blocks);
      })
      .catch(() => resolve([]));
  });
}

module.exports = { getPage, addModal };
