const express = require("express");

const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../controller/brandController");

const {

  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../util/validators/brandValidator");
const { protect, allowedTO } = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    allowedTO("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrand
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    protect,
    allowedTO("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, allowedTO("admin"), deleteBrandValidator, deleteBrand);

module.exports = router;
