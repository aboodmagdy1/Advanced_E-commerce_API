const { check, body } = require("express-validator");
const slugify = require("slug");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");

const User = require("../../models/userModel");
const validatorMiddleware = require("../../middleware/validatorMiddlewares");

exports.getUserValidator = [
  //set of rules
  check("id").isMongoId().withMessage("invalid user id format"),
  //the validator middleware
  validatorMiddleware,
];

exports.createUserValidator = [
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
  check("profileImg").optional(),
  check("role").optional(),
  check("phoneNumber")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid phone Number ...acsept only eg,sa numbers"),

  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
  validatorMiddleware,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("you must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("you must enter password confirmation"),
  body("password")
    .notEmpty()
    .withMessage("you must enter new password")
    .custom(async (val, { req }) => {
      //1)verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("ther is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("current password is incorrect");
      }
      //2)verify passwordConfirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("passwordConfirm is incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

//Users
exports.changeLoggedUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("you must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("you must enter password confirmation"),
  body("password")
    .notEmpty()
    .withMessage("you must enter new password")
    .custom(async (val, { req }) => {
      //1)verify current password
      const user = await User.findById(req.user.id);
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("current password is incorrect");
      }
      //2)verify passwordConfirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("passwordConfirm is incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];
exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
  check("phoneNumber")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid phone number only accepts Egy and SA phones numbers"),
  validatorMiddleware,
];

