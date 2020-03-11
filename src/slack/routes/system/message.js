const { WebClient } = require('@slack/web-api');
const env = require('../../../env');
const web = new WebClient(env.getSlackToken());

function postMessage(requestData, ephemeral) {
  if (ephemeral) return web.chat.postEphemeral(requestData);

  return web.chat.postMessage(requestData);
}

function validate(body) {
  return new Promise((resolve, reject) => {
    if (!body) reject('not body');

    let ephemeral = false;

    if (!body.channel || typeof body.channel !== 'string') reject('not found or valid channel');
    if (!body.blocks && (!body.text || typeof body.text !== 'string')) reject('not found or valid text');
    if (body.ephemeral && !body.user) reject('not found or valid user');

    const requestData = {
      channel: body.channel,
      text: body.text || '',
    };

    if (body.blocks) requestData.blocks = body.blocks;
    if (body.attachments) requestData.attachments = body.attachments;

    if (body.ephemeral) {
      ephemeral = true;
      requestData.user = body.user;
    }

    resolve({ requestData, ephemeral });
  });
}

function post(req, res) {
  validate(req.body)
    .then(({ requestData, ephemeral }) => {
      postMessage(requestData, ephemeral)
        .then(() => res.json({ message: 'success' }))
        .catch((e) => res.status(400).json({ message: `Error send message: ${e}` }));
    })
    .catch((e) => {
      res.status(400).json({ message: `Body Validation error: ${e}` });
    });
}

module.exports = { post };
