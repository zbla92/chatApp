const express = require("express");
const { jwtAuth } = require("../config/auth");

const { getMessages } = require("../controllers/messages");

const router = express.Router();

router.get("/", jwtAuth, getMessages);

module.exports = router;
