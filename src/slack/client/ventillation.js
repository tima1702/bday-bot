const uiBlocks = require('../uiBlocks');
const utils = require('../../utils');
const db = require('../db');
const uiItems = require('../uiItems');
const api = require('../api');

function openAddModal(channel, triggerId) {
  api.views.open(triggerId, uiBlocks.ventillation.addModal(channel));
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
    .then(() =>
      api.chat.postEphemeral(
        channelId,
        userId,
        '',
        uiBlocks.ventillation.successAdded(
          weekDays,
          hours,
          minutes,
          durationMinuteValue,
          uiBlocks.ventillation.typesNotification[notificationValue] || '',
        ),
      ),
    )
    .catch(() => api.chat.postEphemeral(channelId, userId, '', uiBlocks.ventillation.dublicateSchedule()));
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
          uiItems.text.markdownSection(`${checkNotificationType(item.notification_type)}*Проветривание!*`),
        ];

        db.channels.getWeatherCity(record.channel_id).then((weather_city) =>
          uiBlocks.weather.get(weather_city).then((weatherBlock) => {
            blocks.push(weatherBlock);

            blocks.push(
              uiItems.text.markdownSection(
                `Продолжительность: *${record.duration_minute} минут*. Завершение *${utils.time.calcDuration(
                  record.time_hour,
                  record.time_minute,
                  record.duration_minute,
                )}* по GMT`,
              ),
            );

            api.chat.postMessage(record.channel_id, 'Проветривание!', blocks);

            api.chat.scheduleMessage(
              record.channel_id,
              utils.date.getCurrentDate().getTime() / 1000 + record.duration_minute * 60,
              'Проветривание завершено!',
              [
                uiItems.text.markdownSection(
                  `${checkNotificationType(item.notification_type)}*Проветривание завершено!*`,
                ),
              ],
            );
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
  return api.chat.update(channel_id, ts, text, blocks);
}

module.exports = {
  openAddModal,
  successAdded,
  checkScheduleAndSendMessageWatcher,
  checkScheduleAndSendMessage,
  updateMessage,
};
