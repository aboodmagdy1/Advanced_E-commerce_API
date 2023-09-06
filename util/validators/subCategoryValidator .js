const { check, body } = require("express-validator");
const slugify = require("slug");
const validatorMiddleware = require("../../middleware/validatorMiddlewares");

exports.getsubCategoryValidator = [
  //set of rules
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  //the validator middleware
  validatorMiddleware,
];

exports.createsubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name required")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must belong to a parent category")
    .isMongoId()
    .withMessage("invalid subCategory id format"),
  validatorMiddleware,
];

exports.updatesubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true; // Add this line to return a truthy value
  }),

  validatorMiddleware,
];
exports.deletesubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  validatorMiddleware,
];
