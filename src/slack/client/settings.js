const axios = require('axios');
const uiBlocks = require('../uiBlocks');
const dbApp = require('../../db');
const db = require('../db');
const { WebClient } = require('@slack/web-api');
const env = require('../../env');
const web = new WebClient(env.getSlackToken());

function openChangeWeatherModal(channel_id, trigger_id) {
  uiBlocks.settings.weather.changeModal(channel_id).then((view) => {
    web.views.open({ trigger_id, view });
  });
}

function openAddTagModal(channel_id, trigger_id) {
  web.views.open({ trigger_id, view: uiBlocks.settings.tag.addModal(channel_id) });
}

function openAddAdministartorModal(channel_id, trigger_id, webhookUrl) {
  web.views.open({ trigger_id, view: uiBlocks.settings.admins.addModal(channel_id, webhookUrl) });
}

function changeWeatherCityInChannel(channelId, newWeatherCity) {
  return new Promise((resolve, reject) => {
    if (newWeatherCity) {
      dbApp.weather
        .add(newWeatherCity)
        .then((newCityName) => {
          db.channels
            .changeWeatherCity(channelId, newCityName)
            .then((resp) => {
              resolve(newCityName);
            })
            .catch((e) => reject(''));
        })
        .catch(() => reject('not_found'));
      return;
    }
    reject('');
  });
}

function errorAddCurrentUserAdmin(channelId, userId) {
  web.chat.postEphemeral({
    channel: channelId,
    user: userId,
    text: '',
    blocks: uiBlocks.settings.admins.errorAddAdminCurrentUser(),
  });
}

function addUserAdmin(channelId, selectedUserId, adminId, webhookUrl) {
  db.admins
    .add(channelId, selectedUserId)
    .then(() => {
      uiBlocks.settings.admins.manageList(channelId, adminId).then((blocks) =>
        axios.post(webhookUrl, {
          replace_original: 'true',
          blocks,
        }),
      );

      web.chat.postMessage({
        channel: selectedUserId,
        text: '',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<@${adminId}> выдал Вам полномочия администратора в канале <#${channelId}>`,
            },
          },
        ],
      });

      web.dialog;
    })
    .catch((e) => {
      web.chat.postEphemeral({
        channel: channelId,
        user: adminId,
        text: '',
        blocks: uiBlocks.settings.admins.errorAddAdmin(selectedUserId),
      });
    });
}

function removeAdmin(channelId, userId, needRemoveUserId, webhookUrl) {
  if (userId === needRemoveUserId) {
    web.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: '',
      blocks: uiBlocks.settings.admins.errorRemoveAdminCurrentUser(),
    });
    return;
  }

  db.admins
    .remove(channelId, needRemoveUserId)
    .then(() => {
      uiBlocks.settings.admins.manageList(channelId, userId).then((blocks) =>
        axios.post(webhookUrl, {
          replace_original: 'true',
          blocks,
        }),
      );

      web.chat.postMessage({
        channel: needRemoveUserId,
        text: '',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<@${userId}> снял с Вас полномочия администратора в канале <#${channelId}>`,
            },
          },
        ],
      });
    })
    .catch(() =>
      web.chat.postEphemeral({
        channel: channelId,
        user: userId,
        text: '',
        blocks: uiBlocks.settings.admins.errorRemoveAdmin(needRemoveUserId),
      }),
    );
}

module.exports = {
  openChangeWeatherModal,
  changeWeatherCityInChannel,
  openAddAdministartorModal,
  errorAddCurrentUserAdmin,
  addUserAdmin,
  removeAdmin,
  openAddTagModal,
};
