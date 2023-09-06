const express = require("express");

const {
  createCashOrder,
  getAllOrders,
  getOrder,
  filterOrdersForLoggedUser,
  updateOrderToDeliverd,
  updateOrderToPaid,
  checkoutSession
} = require("../controller/orderController");
const { protect, allowedTO } = require("../controller/authController");

const router = express.Router();

router.use(protect);

router.get('/checkout-session/:cartId',allowedTO('user'),checkoutSession)


router.route("/:cartId").post(allowedTO("user"), createCashOrder);
router.get(
  "/",
  allowedTO("admin", "manager", "user"),
  filterOrdersForLoggedUser,
  getAllOrders
);
router.get("/:id", getOrder);

router.use(allowedTO("admin", "manager"));
router.put("/:orderId/pay", updateOrderToPaid);
router.put("/:orderId/deliverd", updateOrderToDeliverd);

module.exports = router;
