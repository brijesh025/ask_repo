const { body, validationResult } = require("express-validator");

const validateSignup = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required"),

    body("email")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    (req, res, next) => {
        const errors = validationResult(req);

        console.log("Validation errors:", errors.array());

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        next();
    },
];
const validateLogin = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        next();
    },
];

module.exports = {
    validateSignup,
    validateLogin
};