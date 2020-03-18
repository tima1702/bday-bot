const utils = require('../../utils');
const db = require('../db');
const uiItems = require('../uiItems');

const typesNotification = { simple: 'Простое сообщение', here: '@here', channel: '@channel' };

const typesWeekDays = {
  monday: 'Пн',
  tuesday: 'Вт',
  wednesday: 'Ср',
  thursday: 'Чт',
  friday: 'Пт',
  saturday: 'Сб',
  sunday: 'Вс',
};

function successAdded(weekDays, hours, minutes, duration, notification) {
  return [
    uiItems.text.markdownSection('*Проветривание успешно добавлено!*'),
    uiItems.text.markdownSection(
      `${weekDays} в *${hours}:${minutes}* по GMT длительность: *${duration} минут*, окончание в *${utils.time.calcDuration(
        hours,
        minutes,
        duration,
      )}* по GMT - ${notification}`,
    ),
  ];
}

function createList(records, isAdmin, channelId) {
  const blocks = [];
  records.forEach((item, i) => {
    const record = item.toJSON();

    const weekDays = [];

    {
      if (record.week_day_monday) weekDays.push('Пн');
      if (record.week_day_tuesday) weekDays.push('Вт');
      if (record.week_day_wednesday) weekDays.push('Ср');
      if (record.week_day_thursday) weekDays.push('Чт');
      if (record.week_day_friday) weekDays.push('Пт');
      if (record.week_day_saturday) weekDays.push('Сб');
      if (record.week_day_sunday) weekDays.push('Вс');
    }

    const data = uiItems.text.markdownSection(
      `${utils.emoji.numberToEmoji(i + 1)} ${typesNotification[record.notification_type]} в *${utils.time.timeToString(
        record.time_hour,
      )}:${utils.time.timeToString(record.time_minute)}* продолжительность *${utils.time.timeToString(
        record.duration_minute,
      )}* минут, завершение *${utils.time.calcDuration(
        record.time_hour,
        record.time_minute,
        record.duration_minute,
      )}* по GMT - ${weekDays.join(', ')}`,
    );

    if (isAdmin)
      data.accessory = {
        type: 'button',
        action_id: `remove_ventillation:${channelId}`,
        text: {
          type: 'plain_text',
          text: 'Удалить',
          emoji: true,
        },
        style: 'danger',
        value: `${JSON.stringify({ record_id: record.id })}`,
      };

    blocks.push(data);
    if (records.length - 1 !== i) {
      blocks.push(uiItems.divider());
    }
  });

  blocks.unshift({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: 'Время указано в GMT',
      },
    ],
  });

  return blocks;
}

function list(channelId, user_id) {
  const scheduleNotFound = [uiItems.text.markdownSection('*Расписание не найдено!*')];

  const scheduleList = (schedule) => {
    return [uiItems.text.markdownSection('*Расписание проветривания:*'), ...schedule];
  };

  return new Promise((resolve) => {
    db.ventillation
      .list(channelId)
      .then((records) => {
        db.admins
          .checkAccess(channelId, user_id)
          .then(() => {
            const schedule = createList(records, true, channelId);

            if (schedule && schedule.length > 1) resolve(scheduleList(schedule));
            resolve(scheduleNotFound);
          })
          .catch(() => {
            const schedule = createList(records, false, channelId);

            if (schedule && schedule.length > 1) resolve(scheduleList(schedule));
            resolve(scheduleNotFound);
          });
      })
      .catch(() => {
        resolve([uiItems.text.markdownSection('*Расписание не найдено!*')]);
      });
  });
}

function dublicateSchedule() {
  return [uiItems.text.markdownSection('*Ошибка добавления расписания!* Такое проветривание уже существует.')];
}

const hours = [];

for (let index = 0; index < 24; index++) {
  hours.push({ label: utils.time.timeToString(index), value: `${index}` });
}

const minutes = [];

for (let index = 0; index < 12; index++) {
  const time = index * 5;
  minutes.push({ label: utils.time.timeToString(time), value: `${time}` });
}

const durationMinutes = [];

for (let index = 1; index <= 12; index++) {
  const time = index * 5;
  durationMinutes.push({ label: utils.time.timeToString(time), value: `${time}` });
}

function addModal(channelId) {
  const days = [
    { label: 'Пн', value: 'monday' },
    { label: 'Вт', value: 'tuesday' },
    { label: 'Ср', value: 'wednesday' },
    { label: 'Чт', value: 'thursday' },
    { label: 'Пт', value: 'friday' },
    { label: 'Сб', value: 'saturday' },
    { label: 'Вс', value: 'sunday' },
  ];

  return {
    type: 'modal',
    callback_id: `modal-ventillation-add:${channelId}`,
    title: {
      type: 'plain_text',
      text: 'Добавление проветривания',
      emoji: true,
    },
    submit: {
      type: 'plain_text',
      text: 'Сохранить',
      emoji: true,
    },
    close: {
      type: 'plain_text',
      text: 'Отмена',
      emoji: true,
    },
    blocks: [
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'Указывайте время в GMT',
          },
        ],
      },
      {
        type: 'input',
        block_id: 'weekDays',
        element: {
          type: 'multi_static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Выберите дни недели',
            emoji: true,
          },
          action_id: 'actionWeekDays',
          options: days.map((item) => ({
            text: {
              type: 'plain_text',
              text: item.label,
              emoji: true,
            },
            value: item.value,
          })),
        },
        label: {
          type: 'plain_text',
          text: 'Дни недели',
          emoji: true,
        },
      },
      {
        type: 'input',
        block_id: 'timeHour',
        element: {
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Выберите час',
            emoji: true,
          },
          action_id: 'actionTimeHour',
          options: hours.map((item) => ({
            text: {
              type: 'plain_text',
              text: item.label,
              emoji: true,
            },
            value: item.value,
          })),
        },
        label: {
          type: 'plain_text',
          text: 'Часы',
          emoji: true,
        },
      },
      {
        type: 'input',
        block_id: 'timeMinute',
        element: {
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Выберите минуты',
            emoji: true,
          },
          action_id: 'actionTimeMinute',
          options: minutes.map((item) => ({
            text: {
              type: 'plain_text',
              text: item.label,
              emoji: true,
            },
            value: item.value,
          })),
        },
        label: {
          type: 'plain_text',
          text: 'Минуты',
          emoji: true,
        },
      },
      {
        type: 'input',
        block_id: 'durationMinute',
        element: {
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Выберите минуты',
            emoji: true,
          },
          action_id: 'actionDurationMinute',
          options: durationMinutes.map((item) => ({
            text: {
              type: 'plain_text',
              text: item.label,
              emoji: true,
            },
            value: item.value,
          })),
        },
        label: {
          type: 'plain_text',
          text: 'Продолжительность',
          emoji: true,
        },
      },
      {
        type: 'input',
        block_id: 'notification',
        element: {
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Выберите тип уведомления',
            emoji: true,
          },
          action_id: 'actionNotification',
          options: [
            {
              text: {
                type: 'plain_text',
                text: 'Простое сообщение',
                emoji: true,
              },
              value: 'simple',
            },
            {
              text: {
                type: 'plain_text',
                text: '@here',
                emoji: true,
              },
              value: 'here',
            },
            {
              text: {
                type: 'plain_text',
                text: '@channel',
                emoji: true,
              },
              value: 'channel',
            },
          ],
        },
        label: {
          type: 'plain_text',
          text: 'Уведомление',
          emoji: true,
        },
      },
    ],
  };
}

module.exports = { addModal, successAdded, dublicateSchedule, list, typesNotification, typesWeekDays };
