const express = require('express');

const { jwtAuth } = require('../config/auth');

const {
  login,
  logout,
  renewToken,
  getAuthUser,
} = require('../controllers/auth');

const router = express.Router();

router.post('/refresh', renewToken);
router.get('/user', jwtAuth, getAuthUser);
router.post('/login', login);
router.post('/logout/:id', logout);

module.exports = router;
