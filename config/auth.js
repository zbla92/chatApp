const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.jwtAuth = async (ctx, next) => {
  const authHeader = ctx.request.header['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return (ctx.status = 401);

  await jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, user) => {
      if (err) return (ctx.status = 403);
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
