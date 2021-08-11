const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.jwtAuth = async (req, res, next) => {
  const authHeader = req.header['authorization'];
  console.log(authHeader, 'header');
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    res.status(401).end();
  }

  await jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, user) => {
      if (err) return res.status(403);
      await next();
    }
  );
};

exports.generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
};

/**
 * @param {object} res Pass through response as res
 * @param {string} refreshToken refreshToken
 */
exports.verifyRefreshToken = (res, refreshToken) => {
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403);
      return;
    }
    const accessToken = this.generateAccessToken(user);
    res.json({ accessToken });
  });
};
