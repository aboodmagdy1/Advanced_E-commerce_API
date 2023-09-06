const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddlewares");
const Product = require("../../models/productModle");

exports.addProductToWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("This is Invalid Id")
    .custom(async(value, { req }) => {
        const product = await  Product.findById(req.body.productId)
        if(!product){
            throw  new Error("Product not found")
        }
    }),
  validatorMiddleware,
];
exports.deleteProductFromWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("This is Invalid Id")
    .custom(async(value, { req }) => {
        const product = await  Product.findById(req.params.productId)
        if(!product){
            throw  new Error("Product not found")
        }
    }),
  validatorMiddleware,
];
