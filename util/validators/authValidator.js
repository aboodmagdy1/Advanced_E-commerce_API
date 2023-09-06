const { check } = require("express-validator");
// eslint-disable-next-line import/no-extraneous-dependencies
const User = require("../../models/userModel");
const validatorMiddleware = require("../../middleware/validatorMiddlewares");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("user name required")
    .isLength({ min: 3 })
    .withMessage("Too short user name"),
  check("email")
    .notEmpty()
    .withMessage(" email is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail is already in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("password confirmation incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),
  validatorMiddleware,
];

exports.loginValidator =[
  check('email').notEmpty().withMessage('email is required').isEmail().withMessage('invalid email address'),
  check('password').notEmpty().withMessage('password is required').isLength({min: 8}).withMessage('password must be at least 8 characters'),
  validatorMiddleware
]
