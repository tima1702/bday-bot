const { Model, DataTypes } = require('sequelize');
const config = require('./config');

class Ventillation extends Model {}
Ventillation.init(
  {
    channel_id: DataTypes.STRING,
    notification_type: DataTypes.STRING,
    time_hour: DataTypes.NUMBER,
    time_minute: DataTypes.NUMBER,
    duration_minute: DataTypes.NUMBER,
    week_day_monday: DataTypes.BOOLEAN,
    week_day_tuesday: DataTypes.BOOLEAN,
    week_day_wednesday: DataTypes.BOOLEAN,
    week_day_thursday: DataTypes.BOOLEAN,
    week_day_friday: DataTypes.BOOLEAN,
    week_day_saturday: DataTypes.BOOLEAN,
    week_day_sunday: DataTypes.BOOLEAN,
  },
  { sequelize: config.db(), modelName: 'ventillation' },
);

/**
 *
 *
 * @param {string} channelId
 * @param {string} notificationType
 * @param {number} timeHour
 * @param {humber} timeMinute
 * @param {number} durationMinute
 * @param {Array.<String>} weekDays
 * @returns {Promise}
 */
function add(channelId, notificationType, timeHour, timeMinute, durationMinute, weekDays = []) {
  return new Promise((resolve, reject) => {
    if (!channelId || !notificationType || !timeHour || !timeMinute || !durationMinute || !weekDays) {
      reject('invalid data');
      return;
    }

    const item = {
      channel_id: channelId,
      notification_type: notificationType,
      time_hour: +timeHour,
      time_minute: +timeMinute,
      duration_minute: +durationMinute,
      week_day_monday: weekDays.includes('monday'),
      week_day_tuesday: weekDays.includes('tuesday'),
      week_day_wednesday: weekDays.includes('wednesday'),
      week_day_thursday: weekDays.includes('thursday'),
      week_day_friday: weekDays.includes('friday'),
      week_day_saturday: weekDays.includes('saturday'),
      week_day_sunday: weekDays.includes('sunday'),
    };

    Ventillation.sync().then(() => {
      Ventillation.count({
        where: item,
      }).then((count) => {
        if (count != 0) {
          reject('Schedule already exists');
        } else {
          Ventillation.sync()
            .then(() => Ventillation.create(item))
            .then(() => {
              resolve('ok');
            })
            .catch((e) => reject(e));
        }
      });
    });
  });
}

function list(channel_id) {
  return Ventillation.findAll({
    where: { channel_id },
    order: [['time_hour', 'ASC'], ['time_minute', 'ASC']],
  });
}

function listRunSchedule(time_hour, time_minute) {
  const currentDay = new Date().getDate();
  const whereObject = {
    where: {
      time_hour,
      time_minute,
    },
  };

  if (currentDay === 1) whereObject.where.week_day_monday = true;
  if (currentDay === 2) whereObject.where.week_day_tuesday = true;
  if (currentDay === 3) whereObject.where.week_day_wednesday = true;
  if (currentDay === 4) whereObject.where.week_day_thursday = true;
  if (currentDay === 5) whereObject.where.week_day_friday = true;
  if (currentDay === 6) whereObject.where.week_day_saturday = true;
  if (currentDay === 0) whereObject.where.week_day_sunday = true;

  return Ventillation.findAll(whereObject);
}

function remove(id) {
  return Ventillation.destroy({ where: { id } });
}

module.exports = { add, list, listRunSchedule, remove };
