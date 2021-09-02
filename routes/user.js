const express = require('express');
const multer = require('multer');

const upload = multer({ dest: './public/data/uploads/' });

const { jwtAuth } = require('../config/auth');
const {
  getAllUsers,
  createNewUser,
  deleteUser,
  getUser,
  uploadProfilePicture,
} = require('../controllers/user');

const router = express.Router();

router.get('/', jwtAuth, getAllUsers);
router.get('/:id', jwtAuth, getUser);
// router.patch('/:id', jwtAuth, editUser);
router.post('/create', createNewUser);
router.delete('/:id', deleteUser);

router.post(
  '/avatar',
  jwtAuth,
  upload.any('uploaded_file'),
  uploadProfilePicture
);

module.exports = router;
