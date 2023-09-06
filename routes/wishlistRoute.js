const express = require("express");

const{getLoggedUserWishlist,addProductToWishlist,deleteProductFromWishlist}= require('../controller/wishlistController');
const { protect ,allowedTO} = require("../controller/authController");
const{addProductToWishlistValidator,deleteProductFromWishlistValidator}=require("../util/validators/wishlistValidator")

const wishlistRouter = express.Router()


wishlistRouter.use(protect,allowedTO("user"))
wishlistRouter.route("/").get(getLoggedUserWishlist).post(addProductToWishlistValidator,addProductToWishlist)
wishlistRouter.route("/:productId").delete(deleteProductFromWishlistValidator,deleteProductFromWishlist)
module.exports = wishlistRouter