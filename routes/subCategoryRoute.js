const express = require("express");

const {
  createFilterObject,
  getSubCategories,
  setCategoryIdToBody,
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controller/subCategoryController");
const {
  createsubCategoryValidator,
  getsubCategoryValidator,
  updatesubCategoryValidator,
  deletesubCategoryValidator,
} = require("../util/validators/subCategoryValidator ");
const { protect, allowedTO } = require("../controller/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getSubCategories)
  .post(
    protect,
    allowedTO("admin", "manager"),
    setCategoryIdToBody,
    createsubCategoryValidator,
    createSubCategory
  );
router
  .route("/:id")
  .get(getsubCategoryValidator, getSubCategory)
  .put(
    protect,
    allowedTO("admin", "manager"),
    updatesubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowedTO("admin"),
    deletesubCategoryValidator,
    deleteSubCategory
  );
module.exports = router;
