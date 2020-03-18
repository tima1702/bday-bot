const api = require('../../api');

function getList(req, res) {
  api.channels
    .list()
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
