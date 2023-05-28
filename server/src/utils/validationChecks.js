const { check } = require("express-validator");

const checkProfile = () => [
  check("bio")
    .isLength({ max: 150 })
    .withMessage("only 150 characters allowed"),
];

const checkRegister = () => [
  check("email")
    .not()
    .isEmpty()
    .withMessage("E-mail is required")
    .isEmail()
    .withMessage("Please include a valid email"),
  check("password")
    .not()
    .isEmpty()
    .isLength({ min: 8 })
    .withMessage("Please enter a password with 8 or more characters"),
];

const checkLogin = () => [
  check("emailOrUname")
    .not()
    .isEmpty()
    .withMessage("E-mail or Username is required"),
  check("password", "Password is required").exists(),
];

module.exports = {
  checkRegister,
  checkLogin,
  checkProfile,
};
