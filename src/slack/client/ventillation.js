const uiBlocks = require('../uiBlocks');
const utils = require('../../utils');
const db = require('../db');
const { WebClient } = require('@slack/web-api');
const env = require('../../env');

function openAddModal(channel, triggerId) {
  const web = new WebClient(env.getSlackToken());

  web.views.open({ trigger_id: triggerId, view: uiBlocks.ventillation.addModal(channel) });
}

function successAdded(
  channelId,
  userId,
  notificationValue,
  timeHourValue,
  timeMinuteValue,
  weekDaysValues,
  durationMinuteValue,
) {
  const web = new WebClient(env.getSlackToken());

  const hours = utils.time.timeToString(timeHourValue);
  const minutes = utils.time.timeToString(timeMinuteValue);
  const weekDays = weekDaysValues.map((item) => uiBlocks.ventillation.typesWeekDays[item] || '').join(', ');

  db.ventillation
    .add(channelId, notificationValue, timeHourValue, timeMinuteValue, durationMinuteValue, weekDaysValues)
    .then(() => {
      web.chat.postEphemeral({
        attachments: [],
        channel: channelId,
        user: userId,
        text: '',
        blocks: uiBlocks.ventillation.successAdded(
          weekDays,
          hours,
          minutes,
          durationMinuteValue,
          uiBlocks.ventillation.typesNotification[notificationValue] || '',
        ),
      });
    })
    .catch(() => {
      web.chat.postEphemeral({
        attachments: [],
        channel: channelId,
        user: userId,
        text: '',
        blocks: uiBlocks.ventillation.dublicateSchedule(),
      });
    });
}

function checkScheduleAndSendMessageWatcher() {
  let lastTime = new Date();

  setInterval(() => {
    const currentTime = new Date();
    if (currentTime.getHours() !== lastTime.getHours() || currentTime.getMinutes() !== lastTime.getMinutes()) {
      const web = new WebClient(env.getSlackToken());
      lastTime = currentTime;

      db.ventillation
        .listRunSchedule(currentTime.getHours(), currentTime.getMinutes())
        .then((records) => {
          records.forEach((item) => {
            const record = item.toJSON();

            const blocks = [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `${
                    item.notification_type === 'here'
                      ? '<!here>'
                      : item.notification_type === 'channel'
                      ? '<!channel>'
                      : ''
                  }*Проветривание!*`,
                },
              },
            ];

            uiBlocks.weather.get('Novocherkassk').then((r) => {
              blocks.push(r);

              blocks.push({
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `Продолжительность: *${record.duration_minute} минут*. Завершение *${utils.time.calcDuration(
                    record.time_hour,
                    record.time_minute,
                    record.duration_minute,
                  )}*`,
                },
              });

              web.chat.postMessage({
                channel: record.channel_id,
                text: '',
                blocks,
              });
            });
          });
        })
        .catch(() => {});
    }
  }, 5000);
}

module.exports = { openAddModal, successAdded, checkScheduleAndSendMessageWatcher };
