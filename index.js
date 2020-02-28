const { WebClient } = require("@slack/web-api");
const env = require("dotenv").config();

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_API_TOKEN;

console.log("TOKEN:", token);

const web = new WebClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = "CUL32BQR4";

web.channels
  .list()
  .then(r => console.log("RESP:", r))
  .catch(r => console.log("catch:", r));

web.chat
  .postMessage({
    channel: conversationId,
    text: "<!channel> Hello there"
  })
  .then(r => console.log("RESP:", r))
  .catch(r => console.log("catch:", r));
