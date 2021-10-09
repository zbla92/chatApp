const express = require("express");
const { jwtAuth } = require("../config/auth");

const { getMessages } = require("../controllers/messages");

const router = express.Router();

router.post("/", jwtAuth, getMessages);

module.exports = router;
