const Router = require('koa-router');
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

const router = new Router({ prefix: '/user' });

router.get('/', jwtAuth, getAllUsers);
router.get('/:id', jwtAuth, getUser);
router.post('/create', createNewUser);
router.delete('/:id', deleteUser);
router.post('/login', login);
router.post('/logout/:userId', jwtAuth, logout);
router.post('/auth/refresh', renewToken);

module.exports = router;