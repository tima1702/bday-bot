const uiItems = require('../uiItems');

function start(userId) {
  return uiItems.text.markdownSection(
    `<!channel> *ВНИМАНИЕ:bangbang: ${userId ? `У <@${userId}> н` : 'Н'}ачался созвон!*`,
  );
}

function remind(userId) {
  return uiItems.text.markdownSection(
    userId
      ? `<!channel> *<@${userId}> напоминает что идет созвон, и просит быть тише!!!* :angry:`
      : '<!channel> *Идет созвон. Просьба быть тише!!!* :angry:',
  );
}

function stop(userId) {
  return uiItems.text.markdownSection(
    `<!channel> *${userId ? `У <@${userId}> з` : 'З'}акончился созвон!* :heavy_check_mark:`,
  );
}

module.exports = { start, remind, stop };
