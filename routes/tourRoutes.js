/**
 * This is a class of tour url routes using express Router.
 * With Aliasing routes set up before the regular routes.
 */

const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./reviewRoutes");
const router = express.Router();

/*
Order of routes:
1. specific routes > general routes
2. static routes > static routes
3. Error routes at last
*/
//Aliasing
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(
  authController.protect,
  authController.restrictTo("admin", "guide","lead-guide"),
  tourController.getMonthlyPlan);


router.route('/tours-within/:distance/center/:latlng/unit/:unit').get( tourController.getTourWithin)
//tours-within?distance=233,center=-40,45&unit=mi
//tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)
//general route
router
  .route("/")
  .get( tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createATour); //checkbody only apply to post
router
  .route("/:id")
  .get(tourController.getATour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.uploadImages, 
    tourController.resizeTourImages,
    tourController.updateATour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteATour
  );

router.use('/:tourId/reviews', reviewRouter)

module.exports = router;
