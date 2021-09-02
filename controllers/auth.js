const { User, RefreshToken } = require('../models');

const {
  generateAccessToken,
  generateRefreshToken,
  destroyToken,
  jwtAuth,
  verifyRefreshToken,
} = require('../config/auth');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('eo u loginu', email, password);
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

    const accessToken = generateAccessToken(user);
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
      { where: { userId: req.params.id } }
    );

    res.status(204).end();
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

exports.renewToken = async (req, res) => {
  const { refreshToken } = req.body;

  const dbRefreshToken = await RefreshToken.findOne({
    where: { value: refreshToken },
  });

  if (refreshToken == null) {
    res.status(401).end();
    return null;
  }

  if (dbRefreshToken?.value !== refreshToken) {
    res.status(403).end();
    return null;
  }
  const result = await verifyRefreshToken(res, refreshToken);
  res.status(200);
  res.json({ accessToken: result });
};
