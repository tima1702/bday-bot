const express = require('express');
const uiBlocks = require('../../uiBlocks');
const axios = require('axios');
const db = require('../../db');
const actionVentillation = require('./ventillation');
const actionSettings = require('./settings');
const client = require('../../client');
const router = express.Router();

router.post('/', function(req, res) {
  if (req.body) {
    if (req.body.challenge) {
      res.json({ challenge: req.body.challenge });
      return;
    }

    if (req.body.payload) {
      const payload = JSON.parse(req.body.payload);
      const view = payload.view || {};
      const userId = payload.user.id || '';

      if (payload.type === 'block_actions') {
        payload.actions.forEach((item) => {
          const [actionType, channelId] = (item.action_id && item.action_id.split(':')) || ['', '', ''];

          switch (actionType) {
            case 'remove_ventillation':
              db.ventillation
                .remove(JSON.parse(item.value).record_id)
                .then(() => {
                  uiBlocks.ventillation.list(channelId, userId).then((blocks) =>
                    axios.post(payload.response_url, {
                      replace_original: 'true',
                      blocks,
                    }),
                  );
                })
                .catch(() => {});

              break;

            case 'add_administrator_privileges':
              client.settings.openAddAdministartorModal(channelId, payload.trigger_id, payload.response_url);
              res.end();
              break;

            case 'remove_administrator_privileges':
              let needDeleteUserId = '';
              payload.actions.some((action) => {
                const [actionType, channelId] = (action.action_id && action.action_id.split(':')) || ['', '', ''];
                if (actionType === 'remove_administrator_privileges') {
                  needDeleteUserId = action.value;
                  return true;
                }
              });
              client.settings.removeAdmin(channelId, userId, needDeleteUserId, payload.response_url);

              res.end();

              break;

            default:
              res.json({
                response_action: 'errors',
              });
              break;
          }
        });
      } else {
        const [callbackType, channelId] = (view.callback_id && view.callback_id.split(':')) || ['', ''];
        switch (callbackType) {
          case 'modal-ventillation-add':
            res.json(actionVentillation.add(view, channelId, userId));
            return;
          case 'modal-settings-weather-change':
            res.json(actionSettings.change(view, channelId, userId));
          case 'modal-add-administrator-privileges':
            if (view.state.values.user_select) {
              let key = '';
              let webhookUrl = '';

              Object.keys(view.state.values.user_select).some((item) => {
                if (item) {
                  const [findKey, findWebhookUrl] = item.split(':::');
                  if (findKey && findWebhookUrl) {
                    key = item;
                    webhookUrl = findWebhookUrl;
                    return true;
                  }
                }
              });

              const selectedUserId =
                (view.state.values.user_select[key] && view.state.values.user_select[key].selected_user) || '';

              if (!userId || !selectedUserId || selectedUserId === userId) {
                client.settings.errorAddCurrentUserAdmin(channelId, userId);
                res.end();
                return;
              }
              client.settings.addUserAdmin(channelId, selectedUserId, userId, webhookUrl);

              res.json({
                response_action: 'clear',
              });
            }
            return;

          default:
            res.json({
              response_action: 'errors',
            });
            break;
        }
      }
    }
  }
  res.end();
});

module.exports = router;
