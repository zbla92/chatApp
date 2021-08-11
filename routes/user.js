const express = require('express');

const { jwtAuth } = require('../config/auth');
const {
  getAllUsers,
  createNewUser,
  deleteUser,
  login,
  getUser,
  logout,
  renewToken,
} = require('../controllers/user');

const router = express.Router();

router.get('/', jwtAuth, getAllUsers);
router.get('/:id', getUser);
router.post('/create', createNewUser);
router.delete('/:id', deleteUser);
router.post('/login', login);
router.post('/logout/:userId', logout);
router.post('/auth/refresh', renewToken);

module.exports = router;
