const express = require("express");
const { handleUserSignUp } = require("../../controller/auth/signup");
const { handleUserLogin } = require("../../controller/auth/login");

const router = express.Router();

router.post('/signup', handleUserSignUp);
router.post('/login', handleUserLogin);

module.exports = router;