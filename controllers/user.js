const { User, RefreshToken } = require('../models');
const {
  generateAccessToken,
  generateRefreshToken,
  destroyToken,
  jwtAuth,
  verifyRefreshToken,
} = require('../config/auth');
const { uploadFile } = require('../config/googleDrive');
require('dotenv').config();

exports.getAllUsers = async (req, res) => {
  try {
    const result = await User.findAll();
    res.json({ data: result });
    res.status(200);
  } catch (error) {
    res.json({ error });
    res.status(500);
  }
};

exports.getUser = async (req, res) => {
  try {
    const result = await User.findByPk(req.params.id, {
      include: [
        {
          model: RefreshToken,
          as: 'refreshToken',
          attributes: ['id', 'value'],
        },
      ],
    });
    res.status(200);
    res.json({ data: result });
  } catch (error) {
    res.json({ error });
    res.status(500);
  }
};

exports.getAuthUser = async (req, res) => {
  try {
    res.status(200);
    res.json({ user: req.userData });
  } catch (err) {
    res.json({ error });
    res.status(500);
  }
};

exports.createNewUser = async (req, res) => {
  const { firstName, lastName, email, password, profilePicture } = req.body;
  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      profilePicture,
    });

    await RefreshToken.create({ userId: user.id, value: null });
    res.json({ user });
    res.status(200);
  } catch (error) {
    res.json({ error });
    res.status(500);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    req.status(204).end();
  } catch (err) {
    res.json({ error });
    res.status(500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ where: { email } });

    if (!userData) {
      res.status(404);
      res.json({ error: 'User not found.' });
      return;
    }

    const isValid = await userData?.validPassword(password);

    if (!isValid) {
      res.status(403);
      res.json({ error: 'Password is incorrect.' });
      return;
    }

    const user = {
      email: userData.email,
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
    };

    const accessToken = generateAccessToken({
      ...user,
      profilePicture: userData.profilePicture,
    });
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.update(
      { value: refreshToken },
      { where: { userId: userData.id } }
    );

    res.json({ tokenType: 'Bearer', accessToken, refreshToken });
  } catch (error) {
    res.json({ error });
    res.status(500);
  }
};

exports.logout = async (req, res) => {
  try {
    const result = await RefreshToken.update(
      { value: null },
      { where: { userId: req.params.userId } }
    );
    res.status(204).end();
  } catch (error) {
    res.json({ error });
    res.status(500);
  }
};

exports.renewToken = async (req, res) => {
  const { refreshToken, userId } = req.body;

  const dbRefreshToken = await RefreshToken.findOne({
    where: { userId },
  });

  if (refreshToken == null) {
    res.status(401).end();
    return null;
  }
  if (dbRefreshToken?.value !== refreshToken) {
    res.status(403).end();
    return null;
  }
  verifyRefreshToken(res, refreshToken);
};

exports.uploadProfilePicture = async (req, res) => {
  const profilePictureLink = await uploadFile(req.files[0].filename);

  if (profilePictureLink) {
    await User.update(
      {
        profilePicture: `https://drive.google.com/uc?id=${profilePictureLink}`,
      },
      { where: { id: req.userData.id } }
    );

    res.status(204).end();
  } else res.status(400).end();

  console.log(req.files[0], req.body);
};
