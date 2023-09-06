const express = require("express");

const {createReviewValidator,getReviewValidator,updateReviewValidator,deleteReviewValidator} = require('../util/validators/reviewsValidator')
const {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../controller/reviewsController");

const { protect, allowedTO } = require("../controller/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    protect,
    allowedTO("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    protect,
    allowedTO("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    protect,
    allowedTO("user", "manager", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
