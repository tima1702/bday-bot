const client = require('../../client');

function add(view, channelId, userId) {
  const notificationValue = view.state.values.notification.actionNotification.selected_option.value || 0;
  const timeHourValue = view.state.values.timeHour.actionTimeHour.selected_option.value || 0;
  const timeMinuteValue = view.state.values.timeMinute.actionTimeMinute.selected_option.value || 0;
  const durationMinuteValue = view.state.values.durationMinute.actionDurationMinute.selected_option.value || 0;
  let weekDaysValue = view.state.values.weekDays.actionWeekDays.selected_options.map(({ value }) => value) || [];

  {
    // sort

    const newWeekDaysValue = [];
    if (weekDaysValue.includes('monday')) newWeekDaysValue.push('monday');
    if (weekDaysValue.includes('tuesday')) newWeekDaysValue.push('tuesday');
    if (weekDaysValue.includes('wednesday')) newWeekDaysValue.push('wednesday');
    if (weekDaysValue.includes('thursday')) newWeekDaysValue.push('thursday');
    if (weekDaysValue.includes('friday')) newWeekDaysValue.push('friday');
    if (weekDaysValue.includes('saturday')) newWeekDaysValue.push('saturday');
    if (weekDaysValue.includes('sunday')) newWeekDaysValue.push('sunday');

    weekDaysValue = newWeekDaysValue;
  }

  client.ventillation.successAdded(
    channelId,
    userId,
    notificationValue,
    timeHourValue,
    timeMinuteValue,
    weekDaysValue,
    durationMinuteValue,
  );

  return {
    response_action: 'clear',
  };
}

module.exports = { add };
