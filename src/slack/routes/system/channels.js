const { WebClient } = require('@slack/web-api');
const env = require('../../../env');
const web = new WebClient(env.getSlackToken());

function getList(req, res) {
  web.channels
    .list()
    .then((data) => {
      if (!data || !data.ok) res.status(400).end();

      res.json(
        data.channels.map(({ id, name, name_normalized, creator, members }) => ({
          id,
          name,
          name_normalized,
          creator,
          members,
        })),
      );
    })
    .catch(() => res.status(400).end());
}

module.exports = { getList };
