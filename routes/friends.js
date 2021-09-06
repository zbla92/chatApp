const express = require('express');

const { jwtAuth } = require('../config/auth');
const { getOnlineFriends } = require('../controllers/friends');

const router = express.Router();

router.get('/online', jwtAuth, getOnlineFriends);

module.exports = router;
