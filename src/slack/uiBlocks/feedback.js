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
            type: 'multi_external_select',
            placeholder: {
              type: 'plain_text',
              text: 'Выберите теги (начните ввод)',
            },
            min_query_length: 1,
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

function feedbackItem(record, count, userId, page, user, tag) {
  const newBlocks = [
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
          text: `*ID:* ${record.id} | *Теги:* ${
            record.tags && record.tags.length ? record.tags.join(', ') : 'не указаны'
          } | *Дата:* _${record.date} по GMT_`,
        },
      ],
    },
  ];

  if (userId && record.slackUserId === userId) {
    const maxPageAfterDelete = Math.ceil((count - 1) / 3) - 1;
    newBlocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Вы можете удалить этот отзыв:',
      },
      accessory: {
        action_id: `deleteFeedback:${JSON.stringify({
          page: maxPageAfterDelete < page ? maxPageAfterDelete : page,
          tag,
          user,
        })}`,
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Удалить',
          emoji: true,
        },
        confirm: {
          title: {
            type: 'plain_text',
            text: 'Вы уверены?',
          },
          text: {
            type: 'mrkdwn',
            text: `Вы действительно хотите удалить отзыв к статье: *_${record.title}_*?`,
          },
          confirm: {
            type: 'plain_text',
            text: 'Да',
          },
          deny: {
            type: 'plain_text',
            text: 'Стоп! Я передумал!',
          },
        },
        style: 'danger',
        value: `${record.id}`,
      },
    });
  }

  return newBlocks;
}

function getPage(page = 0, user = '', tag = '', userId = '') {
  return new Promise((resolve) => {
    Promise.all([
      dbApp.feedback.getPage(page, user, tag).catch(() => resolve([])),
      dbApp.feedbackTags.getNameById(tag),
    ]).then(([{ records, count }, tagName]) => {
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
        records.forEach((record) =>
          blocks.push(...feedbackItem(record, count, userId, page, user, tag), {
            type: 'divider',
          }),
        );

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
        let text = '*Не найдено ни одного отзыва!*';
        if (user) text = `*Пользователь <@${user}> еще не оставлял отзывов.*`;
        if (tag) text = `*Тег _${tagName}_ еще не закреплен не за одним отзывом*`;
        if (user && tag) text = `*Пользователь <@${user}> еще не оставлял отзывов c тегом _${tagName}_*`;

        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text,
          },
        });
      }

      blocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Выберите пользователя',
          },
          accessory: {
            type: 'users_select',
            action_id: `userPageInFeedBack:${JSON.stringify({ page, tag })}`,
            placeholder: {
              type: 'plain_text',
              text: 'Все',
              emoji: true,
            },
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Выберите тег',
          },
          block_id: 'feedbackTags',
          accessory: {
            type: 'external_select',
            action_id: `tagInFeedBack:${JSON.stringify({ page, tag, user })}`,
            placeholder: {
              type: 'plain_text',
              text: 'Все',
              emoji: true,
            },
            min_query_length: 1,
          },
        },
      );

      if (user || tag) {
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

        if (tag) {
          blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Выбран тег *${tagName}*`,
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
              action_id: `nextPageInFeedBack:${JSON.stringify({ page: 0, user, first: true, tag })}`,
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '<<< Сюда',
              },
              value: 'cancel',
              action_id: `nextPageInFeedBack:${JSON.stringify({ page: page - 1, user, tag })}`,
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
            action_id: `nextPageInFeedBack:${JSON.stringify({ page: page + 1, user, tag })}`,
          });

          buttons[1].elements.push({
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'На последнюю',
            },
            value: 'cancel',
            action_id: `nextPageInFeedBack:${JSON.stringify({ page: countPages - 1, user, last: true, tag })}`,
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

      console.log('..........blocks', JSON.stringify(blocks, null, '\t'));

      resolve(blocks);
    });
  });
}

module.exports = { getPage, addModal };
