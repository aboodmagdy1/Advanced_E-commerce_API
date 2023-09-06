const factory = require("./handlersFactory");
const Coupon = require("../models/couponModel");



//@desc Get Coupons
//@route GET /api/v1/coupons
//@access Private/Admin-Manger
exports.getCoupons =factory.getAll(Coupon)

//@desc Create Coupon
//@route POST /api/v1/coupons
//@access Private/Admin-Manger
exports.createCoupon = factory.createOne(Coupon)
//@desc   get specifc Coupon by id
//@route  GET /api/v1/coupons/:id
//@access Private/Admin-Manger
exports.getCoupon =factory.getOne(Coupon)



//@desc   UPDATE specifc Coupon
//@route  (PATCH/PUT )/api/v1/coupons/:id
//@access Private/Admin-Manger
exports.updateCoupon = factory.updateOne(Coupon)
//@desc   Delete specifc Coupon
//@route  DELETE /api/v1/coupons/:id
//@access Private/Admin-Manger
exports.deleteCoupon = factory.deleteOne(Coupon);
