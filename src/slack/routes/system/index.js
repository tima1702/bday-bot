const channels = require('./channels');
const message = require('./message');

const express = require('express');
const router = express.Router();

router.get('/channels', channels.getList);
router.post('/message', message.post);

module.exports = router;
