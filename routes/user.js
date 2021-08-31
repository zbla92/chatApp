const express = require('express');
const multer = require('multer');

const upload = multer({ dest: './public/data/uploads/' });

const { jwtAuth } = require('../config/auth');
const {
  getAllUsers,
  getAuthUser,
  createNewUser,
  deleteUser,
  login,
  getUser,
  logout,
  renewToken,
  uploadProfilePicture,
} = require('../controllers/user');

const router = express.Router();

router.get('/', jwtAuth, getAllUsers);
router.get('/auth', jwtAuth, getAuthUser);
router.get('/:id', jwtAuth, getUser);
// router.patch('/:id', jwtAuth, editUser);
router.post('/create', createNewUser);
router.delete('/:id', deleteUser);
router.post('/login', login);
router.post('/logout/:id', logout);
router.post('/auth/refresh', renewToken);
router.post(
  '/avatar',
  jwtAuth,
  upload.any('uploaded_file'),
  uploadProfilePicture
);

module.exports = router;
