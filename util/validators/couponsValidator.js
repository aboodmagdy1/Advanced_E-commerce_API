const { check } = require("express-validator");
const Coupon = require("../../models/couponModel");
const validatorMiddleware = require("../../middleware/validatorMiddlewares");

exports.createCouponValidtor = [
  check("name")
    .notEmpty()
    .withMessage("Coupon Name is required")
    .toUpperCase()
    .custom(async (val) => {
      const coupon = await Coupon.findOne({ name: val });
      if (coupon) {
        throw new Error("Coupon Name Must be Unique");
      }
    }),
  check("expire")
    .notEmpty()
    .withMessage("Coupon Expire is required"),
  check("discount").notEmpty().withMessage("Coupon discount is required"),
  validatorMiddleware
];
exports.getCouponValidtor = [
    check("id").isMongoId().withMessage("Invalid Coupon Id")
  ,validatorMiddleware
];
exports.updateCouponValidtor = [
    check("id").isMongoId().withMessage("Invalid Coupon Id")
  ,validatorMiddleware
];
exports.deleteCouponValidtor = [
    check("id").isMongoId().withMessage("Invalid Coupon Id")
  ,validatorMiddleware
];
