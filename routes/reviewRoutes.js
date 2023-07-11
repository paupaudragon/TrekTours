const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({
  mergeParams: true, //for nested routes
});

router.use(authController.protect);

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(authController.restrictTo("user"),reviewController.deleteReview)
  .patch(authController.restrictTo("user"),reviewController.updateReview);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

module.exports = router;
