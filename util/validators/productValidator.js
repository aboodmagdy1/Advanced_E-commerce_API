const { check, body } = require("express-validator");
const slugify = require("slug");

const validatorMiddleware = require("../../middleware/validatorMiddlewares");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least chars")
    .notEmpty()
    .withMessage("Product title required"),
  check("description")
    .notEmpty()
    .withMessage("Product description required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value)
        throw new Error("priceAfterDiscount must be lower than price");
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("available Colors should be array of strings"),
  check("imageCover").notEmpty().withMessage("product imabeCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of strings"),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("RatingsAverage must be above or equal to 1")
    .isLength({ max: 5 })
    .withMessage("RatingsAverage must be below or equal to 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  check("category")
    .notEmpty()
    .withMessage("product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id ${categoryId}`)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((subcategoriesId) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesId } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesId.length)
            return Promise.reject(new Error(`invalid subcategories Ids `));
        }
      )
    )
    .custom((subcategoriesId, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdInDB = []; //array of id's of all subcategories in DB
          subcategories.forEach((subcategory) => {
            subCategoriesIdInDB.push(subcategory._id.toString());
          });
          //check if subcategoriesid in Db includes subcategories in the req.body
          const idIsExistInDB = subcategoriesId.every((id) =>
            subCategoriesIdInDB.includes(id)
          );
          if (!idIsExistInDB) {
            return Promise.reject(
              new Error(`subcategories not belong to category`)
            );
          }
        }
      )
    ),

  check("brand").optional().isMongoId().withMessage("Invalid ID format"),
  body('title').custom((val,{req})=>{
    req.body.slug = slugify(val)
    return true
})
,

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true; // Add this line to return a truthy value
    }),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];
