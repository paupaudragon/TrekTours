const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

//Aliasing
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)
router.route('/tour-stats').get(tourController.getTourStats)

//route
router.route('/').get(tourController.getAllTours).post(tourController.createATour)//checkbody only apply to post
router.route('/:id').get(tourController.getATour).patch(tourController.updateATour).delete(tourController.deleteATour)



module.exports = router; 