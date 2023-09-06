const express = require("express");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../controller/categoryController");
const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../util/validators/categoryValidator");
const { protect, allowedTO } = require("../controller/authController");

const router = express.Router();
const subCategoriesRoute = require("./subCategoryRoute");

router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    allowedTO("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    protect,
    allowedTO("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    protect,
    allowedTO("admin",),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
