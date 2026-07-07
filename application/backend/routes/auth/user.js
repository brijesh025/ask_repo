const express = require("express");
const { handleUserSignUp } = require("../../controller/auth/signup");
const { handleUserLogin } = require("../../controller/auth/login");
const { checkForAuthentication } = require("../../middlewares/auth/auth");
const { validateSignup,validateLogin } = require("../../middlewares/validators/authValidator");
const { handleGetCurrentUser } = require("../../controller/auth/me");
const { handleUserLogout } = require("../../controller/auth/logout");


const router = express.Router();

router.post(
    '/signup', 
    validateSignup,
    handleUserSignUp
);
router.post('/login',validateLogin, handleUserLogin);
router.get(
    "/me",
    checkForAuthentication,
    handleGetCurrentUser
);
router.post(
    "/logout",
    handleUserLogout
);
module.exports = router;