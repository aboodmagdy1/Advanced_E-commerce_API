const express = require("express");

const {getLoggedUserCart, addProductToCart,removeProductFromCart ,clearCart,updateProductQuientity,applayCoupon} = require("../controller/cartController");

const { protect, allowedTO } = require("../controller/authController");

const router = express.Router();

router.use(protect, allowedTO("user"));
router.route("/").get(getLoggedUserCart).post(addProductToCart).delete(clearCart)
router.route("/applyCoupon").put(applayCoupon)
router.route("/:itemId").put(updateProductQuientity).delete(removeProductFromCart)

module.exports = router;
