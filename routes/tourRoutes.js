const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

//route
router.route('/').get(tourController.getAllTours).post(tourController.createATour)//checkbody only apply to post
router.route('/:id').get(tourController.getATour).patch(tourController.updateATour).delete(tourController.deleteATour)


module.exports = router; 