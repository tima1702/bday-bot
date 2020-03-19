const uiItems = require('../uiItems');

function start(userId) {
  return uiItems.text.markdownSection(`<!channel> *ВНИМАНИЕ:bangbang: У <@${userId}> начался созвон!*`);
}

function remind(userId) {
  return uiItems.text.markdownSection(
    `<!channel> *<@${userId}> напоминает что идет созвон, и просит быть тише!!!* :angry:`,
  );
}

function stop(userId) {
  return uiItems.text.markdownSection(`<!channel> *У <@${userId}> закончился созвон!* :heavy_check_mark:`);
}

module.exports = { start, remind, stop };
