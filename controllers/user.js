const { User, RefreshToken } = require('../models');

const { uploadFile } = require('../config/googleDrive');
const { standardizeUser } = require('../utils/user-utils');
require('dotenv').config();

exports.getAllUsers = async (req, res) => {
  try {
    const result = await User.findAll();

    const prepUsers = result?.map((user) => standardizeUser(user));

    res.json({ data: prepUsers });
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
