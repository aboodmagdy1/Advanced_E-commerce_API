const express = require("express");

const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponController");
const{createCouponValidtor,getCouponValidtor,updateCouponValidtor,deleteCouponValidtor} = require('../util/validators/couponsValidator')
const { protect, allowedTO } = require("../controller/authController");

const router = express.Router();

router.use(protect, allowedTO("admin", "manager"));
router.route("/").get(getCoupons).post(createCouponValidtor,createCoupon);
router.route("/:id").get(getCouponValidtor,getCoupon).put(updateCouponValidtor,updateCoupon).delete(deleteCouponValidtor,deleteCoupon);
module.exports = router;
