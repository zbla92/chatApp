/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.jwtAuth = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) {
		res.status(401).end();
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
		// Delete the image that is uploaded
		if (!user) return res.status(401).end();

		req.userData = user;
		if (err) return res.status(401).end();
		await next();
	});
};

exports.generateAccessToken = (user) =>
	jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "30m",
	});

exports.generateRefreshToken = (user) =>
	jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

/**
 * @param {object} res Pass through response as res
 * @param {string} refreshToken refreshToken
 */
exports.verifyRefreshToken = async (res, refreshToken) =>
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		// eslint-disable-next-line consistent-return
		(err, user) => {
			if (user) {
				const userData = {
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					id: user.id,
				};

				const accessToken = this.generateAccessToken(userData);
				return accessToken;
			}
			if (err) {
				res.status(403).end();
			}
		}
	);
