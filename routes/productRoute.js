const express = require("express");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProducts,
  deleteProducts,
  uploadProductImages,
  resizeProductImages,
} = require("../controller/productController");
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../util/validators/productValidator");
const { protect, allowedTO } = require("../controller/authController");

const productRouter = express.Router();
const reviewRouter= require("./reviewRoutes")

productRouter.use('/:productId/reviews',reviewRouter)
productRouter.get("/", getProducts);
productRouter.post("/", protect,allowedTO('admin','manager'),uploadProductImages,resizeProductImages,createProductValidator, createProduct);
productRouter.get("/:id", getProductValidator, getProduct);
productRouter.patch("/:id",protect,allowedTO('admin','manager'),uploadProductImages,resizeProductImages, updateProductValidator, updateProducts);
productRouter.delete("/:id", protect,allowedTO('admin'),deleteProductValidator, deleteProducts);

module.exports = productRouter;
