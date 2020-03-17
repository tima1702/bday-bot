const actionVentillation = require('./ventillation');
const actionFeedback = require('./feedback');
const actionSettings = require('./settings');
const actionTag = require('./tag');
const express = require('express');
const uiBlocks = require('../../uiBlocks');
const axios = require('axios');
const db = require('../../db');
const dbApp = require('../../../db');
const client = require('../../client');
const router = express.Router();

router.post('/select', function(req, res) {
  if (req && req.body && req.body.payload) {
    const payload = JSON.parse(req.body.payload);

    switch (payload.block_id) {
      case 'feedbackTags':
        dbApp.feedbackTags.findTags(payload.value || '').then((arr) => {
          res.json({
            options: arr.map((item) => ({
              text: {
                type: 'plain_text',
                text: `${item.name || ''}`,
              },
              value: `${item.id || ''}`,
            })),
          });
        });

        return;

      default:
        res.json({
          options: [],
        });
        return;
    }
  }
});

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
        const updatePageFeedback = (page, user, tag) => {
          uiBlocks.feedback.getPage(page, user, tag, userId).then((blocks) => {
            axios.post(payload.response_url, {
              replace_original: 'true',
              blocks,
            });
          });
        };

        payload.actions.forEach((item) => {
          const [actionType, channelId] = (item.action_id && item.action_id.split(':')) || ['', ''];
          let additionalData = {};
          try {
            additionalData = JSON.parse(item.action_id.replace(`${actionType}:`, ''));
          } catch (e) {
            additionalData = {};
          }

          switch (actionType) {
            case 'deleteFeedback':
              dbApp.feedback
                .deleteById(item.value)
                .then(() =>
                  updatePageFeedback(additionalData.page || 0, additionalData.user || '', additionalData.tag || ''),
                );
              break;

            case 'clearFiltersPageInFeedBack':
              updatePageFeedback(0, '', '');
              break;

            case 'userPageInFeedBack':
              updatePageFeedback(0, item.selected_user || '', additionalData.tag || '');
              break;

            case 'nextPageInFeedBack':
              updatePageFeedback(additionalData.page || 0, additionalData.user || '', additionalData.tag || '');
              break;

            case 'tagInFeedBack':
              updatePageFeedback(0, additionalData.user || '', item.selected_option.value || '');
              break;

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
          case 'modal-feedback-add':
            res.json(actionFeedback.add(view, channelId, userId));
            return;
          case 'modal-settings-weather-change':
            res.json(actionSettings.change(view, channelId, userId));
          case 'modal-settings-tag-add':
            res.json(actionTag.add(view, channelId, userId));
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
