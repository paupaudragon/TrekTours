const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();


router.route('/').get(tourController.getAllTours).post(tourController.createATour)
router.route('/:id').get(tourController.getATour).patch(tourController.updateATour).delete(tourController.deleteATour)


module.exports = router; 