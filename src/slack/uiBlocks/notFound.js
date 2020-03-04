function commandNotFound(slash, command = '') {
  switch (slash) {
    case 'ventillation':
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
              text: '*add* - добавить время',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*schedule* - получить расписание',
            },
          },
        ],
      };

    case 'settings':
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
              text: '*weather* - добавить/изменить город погоды',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*admin* - управление администраторами',
            },
          },
        ],
      };

    default:
      return {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Такой команды не существует!',
            },
          },
        ],
      };
      break;
  }
}

module.exports = { commandNotFound };
