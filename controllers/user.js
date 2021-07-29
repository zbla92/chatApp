const { User, RefreshToken } = require('../models');
const {
  generateAccessToken,
  generateRefreshToken,
  destroyToken,
  jwtAuth,
  verifyRefreshToken,
} = require('../config/auth');
require('dotenv').config();

exports.getAllUsers = async (ctx, next) => {
  try {
    const result = await User.findAll();
    ctx.status = 200;
    ctx.body = { data: result };
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.getUser = async (ctx, next) => {
  try {
    const result = await User.findByPk(ctx.params.id, {
      include: [
        {
          model: RefreshToken,
          as: 'refreshToken',
          attributes: ['id', 'value'],
        },
      ],
    });
    ctx.status = 200;
    ctx.body = { data: result };
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.createNewUser = async (ctx, next) => {
  const { firstName, lastName, email, password, profilePicture } =
    ctx.request.body;
  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      profilePicture,
    });

    await RefreshToken.create({ userId: user.id, value: null });
    ctx.body = { user };
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.deleteUser = async (ctx, next) => {
  try {
    await User.destroy({ where: { id: ctx.params.id } });
    ctx.status = 204;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.login = async (ctx, next) => {
  try {
    const { email } = ctx.request.body;
    const userData = await User.findOne({ where: { email } });

    const user = {
      email: userData.email,
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
    };

    const accessToken = generateAccessToken({ user });
    const refreshToken = generateRefreshToken({ user });

    await RefreshToken.update(
      { value: refreshToken },
      { where: { userId: userData.id } }
    );

    ctx.body = { tokenType: 'Bearer', accessToken, refreshToken };
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.logout = async (ctx, next) => {
  try {
    const result = await RefreshToken.update(
      { value: null },
      { where: { userId: ctx.params.userId } }
    );
    ctx.status = 204;
  } catch (err) {
    ctx.throw(500, err);
  }
};

exports.renewToken = async (ctx, next) => {
  const { refreshToken, userId } = ctx.request.body;

  const dbRefreshToken = await RefreshToken.findOne({
    where: { userId },
  });

  if (refreshToken == null) {
    ctx.status = 401;
    return null;
  }
  if (dbRefreshToken.value !== refreshToken) {
    ctx.status = 403;
    return null;
  }
  verifyRefreshToken(ctx, refreshToken);
};
