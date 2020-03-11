const uiBlocks = require('../uiBlocks');
const utils = require('../../utils');
const db = require('../db');
const { WebClient } = require('@slack/web-api');
const env = require('../../env');
const web = new WebClient(env.getSlackToken());

function openAddModal(channel, triggerId) {
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
  const hours = utils.time.timeToString(timeHourValue);
  const minutes = utils.time.timeToString(timeMinuteValue);
  const weekDays = weekDaysValues.map((item) => uiBlocks.ventillation.typesWeekDays[item] || '').join(', ');

  db.ventillation
    .add(channelId, notificationValue, timeHourValue, timeMinuteValue, durationMinuteValue, weekDaysValues)
    .then(() => {
      web.chat.postEphemeral({
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
        channel: channelId,
        user: userId,
        text: '',
        blocks: uiBlocks.ventillation.dublicateSchedule(),
      });
    });
}

function checkNotificationType(type) {
  return type === 'here' ? '<!here> ' : type === 'channel' ? '<!channel> ' : '';
}

function checkScheduleAndSendMessage(currentTime) {
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
              text: `${checkNotificationType(item.notification_type)}*Проветривание!*`,
            },
          },
        ];

        db.channels.getWeatherCity(record.channel_id).then((weather_city) =>
          uiBlocks.weather.get(weather_city).then((weatherBlock) => {
            blocks.push(weatherBlock);

            blocks.push({
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `Продолжительность: *${record.duration_minute} минут*. Завершение *${utils.time.calcDuration(
                  record.time_hour,
                  record.time_minute,
                  record.duration_minute,
                )}* по GMT`,
              },
            });

            web.chat.postMessage({
              channel: record.channel_id,
              text: 'Проветривание!',
              blocks,
            });

            web.chat.scheduleMessage({
              channel: record.channel_id,
              post_at: utils.date.getCurrentDate().getTime() / 1000 + record.duration_minute * 60,
              text: 'Проветривание завершено!',
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `${checkNotificationType(item.notification_type)}*Проветривание завершено!*`,
                  },
                },
              ],
            });
          }),
        );
      });
    })
    .catch(() => {});
}

function checkScheduleAndSendMessageWatcher() {
  let lastTime = utils.date.getCurrentDate();

  checkScheduleAndSendMessage(lastTime);

  setInterval(() => {
    const currentTime = utils.date.getCurrentDate();
    if (currentTime.getHours() !== lastTime.getHours() || currentTime.getMinutes() !== lastTime.getMinutes()) {
      lastTime = currentTime;
      checkScheduleAndSendMessage(currentTime);
    }
  }, 5000);
}

function updateMessage(ts, channel_id, text, blocks) {
  web.chat.update({ channel_id, text, ts, blocks });
}

module.exports = {
  openAddModal,
  successAdded,
  checkScheduleAndSendMessageWatcher,
  checkScheduleAndSendMessage,
  updateMessage,
};
