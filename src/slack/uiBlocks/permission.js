function accessDeniedBlocks() {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':bangbang:*Ошибка! Доступ к этому функционалу запрещен!*:lock:',
      },
    },
  ];
}

module.exports = { accessDeniedBlocks };
