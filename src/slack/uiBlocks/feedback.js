const utils = require('../../utils');
const dbApp = require('../../db');
const uiItems = require('../uiItems');

function addOrEditModal(channelId, initalValues = null) {
  return new Promise((resolve) => {
    const modal = uiItems.modal.create(
      `${initalValues ? 'Редактирование' : 'Добавление'} отзыва`,
      `modal-feedback-${initalValues ? 'edit' : 'add'}:${channelId}`,
      [
        {
          type: 'input',
          block_id: 'feedbackTitle',
          element: {
            action_id: 'actionFeedbackTitle',
            type: 'plain_text_input',
            placeholder: {
              type: 'plain_text',
              text: 'Введите название',
            },
          },
          label: {
            type: 'plain_text',
            text: 'Название',
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
            },
          },
          label: {
            type: 'plain_text',
            text: 'URL',
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
            },
          },
          label: {
            type: 'plain_text',
            text: 'Отзыв',
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
      {},
      initalValues ? 'Изменить' : 'Добавить',
    );

    if (initalValues && typeof initalValues === 'object') {
      modal.blocks.forEach((block, blockId) => {
        Object.keys(initalValues).forEach((key) => {
          if (block.block_id === key) {
            if (typeof initalValues[key] === 'string') {
              modal.blocks[blockId].element.initial_value = initalValues[key];
            } else {
              modal.blocks[blockId].element.initial_options = initalValues[key];
            }
          }
        });
      });
    }
    resolve(modal);
  });
}

function feedbackItem(record, count, userId, page, user, tag) {
  const newBlocks = [
    uiItems.text.markdownSection(
      `*${record.title}* ${record.url ? `<${record.url}|Открыть статью>` : '_URL не указан_'}`,
    ),
    uiItems.text.markdownSection(`${record.slackUserId ? `<@${record.slackUserId}>` : ''} ${record.message || ''}`),
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
    newBlocks.push(uiItems.text.markdownSection('*Действия с отзывом:*'), {
      type: 'actions',
      elements: [
        uiItems.actions.button(
          'Изменить',
          `${record.id}`,
          `editFeedback:${JSON.stringify({
            page,
            tag,
            user,
          })}`,
        ),
        uiItems.actions.button(
          'Удалить',
          `${record.id}`,
          `deleteFeedback:${JSON.stringify({
            page: maxPageAfterDelete < page ? maxPageAfterDelete : page,
            tag,
            user,
          })}`,
          {
            confirm: uiItems.confirm(
              'Вы уверены?',
              `Вы действительно хотите удалить отзыв к статье: *_${record.title}_*?`,
            ),
            style: 'danger',
          },
        ),
      ],
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
      const blocks = [uiItems.text.markdownSection('*Отзывы*'), uiItems.divider()];

      if (count > 0) {
        records.forEach((record) =>
          blocks.push(...feedbackItem(record, count, userId, page, user, tag), uiItems.divider()),
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
          uiItems.divider(),
        );
      } else {
        let text = '*Не найдено ни одного отзыва!*';
        if (user) text = `*Пользователь <@${user}> еще не оставлял отзывов.*`;
        if (tag) text = `*Тег _${tagName}_ еще не закреплен не за одним отзывом*`;
        if (user && tag) text = `*Пользователь <@${user}> еще не оставлял отзывов c тегом _${tagName}_*`;

        blocks.push(uiItems.text.markdownSection(text));
      }

      blocks.push(
        uiItems.text.markdownSection('Выберите пользователя', {
          accessory: {
            type: 'users_select',
            action_id: `userPageInFeedBack:${JSON.stringify({ page, tag })}`,
            placeholder: {
              type: 'plain_text',
              text: 'Все',
            },
          },
        }),

        uiItems.text.markdownSection('Выберите тег', {
          block_id: 'feedbackTags',
          accessory: {
            type: 'external_select',
            action_id: `tagInFeedBack:${JSON.stringify({ page, tag, user })}`,
            placeholder: {
              type: 'plain_text',
              text: 'Все',
            },
            min_query_length: 1,
          },
        }),
      );

      if (user || tag) {
        blocks.push(uiItems.text.markdownSection('*Установлены фильтры:*'));

        if (user) {
          blocks.push(uiItems.text.markdownSection(`Выбран пользователь <@${user}>`));
        }

        if (tag) {
          blocks.push(uiItems.text.markdownSection(`Выбран тег *${tagName}*`));
        }

        blocks.push({
          type: 'actions',
          block_id: 'clearfiltersPageInFeedBack:',
          elements: [
            uiItems.actions.button('Сбросить фильтры', 'cancel', 'clearFiltersPageInFeedBack:{}', { style: 'danger' }),
          ],
        });
      }

      if (count > 3) {
        const countPages = Math.ceil(count / 3);

        const buttons = [
          uiItems.text.markdownSection('*Навигация:*'),
          {
            type: 'actions',
            block_id: `changePageInFeedBack:`,
            elements: [],
          },
        ];

        if (page > 0) {
          buttons[1].elements.push(
            uiItems.actions.button(
              'На первую',
              'cancel',
              `nextPageInFeedBack:${JSON.stringify({
                page: 0,
                user,
                first: true,
                tag,
              })}`,
            ),
            uiItems.actions.button(
              '<<< Сюда',
              'cancel',
              `nextPageInFeedBack:${JSON.stringify({
                page: page - 1,
                user,
                tag,
              })}`,
            ),
          );
        }

        if (page + 1 < countPages) {
          buttons[1].elements.push(
            uiItems.actions.button(
              'Туда >>>',
              'cancel',
              `nextPageInFeedBack:${JSON.stringify({
                page: page + 1,
                user,
                tag,
              })}`,
            ),
          );

          buttons[1].elements.push(
            uiItems.actions.button(
              'На последнюю',
              'cancel',
              `nextPageInFeedBack:${JSON.stringify({
                page: countPages - 1,
                user,
                last: true,
                tag,
              })}`,
            ),
          );
        }

        blocks.push(uiItems.divider(), ...buttons);
      }

      console.log('BYTES: ', utils.byteCount.string(JSON.stringify({ blocks })));

      resolve(blocks);
    });
  });
}

function successAdded() {
  return uiItems.text.markdownSection('*Отзыв успешно добавлен!*');
}

function errorAdded() {
  return uiItems.text.markdownSection('*Ошибка добавления отзыва!*');
}

module.exports = { getPage, addOrEditModal, successAdded, errorAdded };
