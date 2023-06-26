const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

//param middleware
//apply to all that have id
router.param('id',tourController.checkID)

//route
router.route('/').get(tourController.getAllTours).post(tourController.checkBody,tourController.createATour)//checkbody only apply to post
router.route('/:id').get(tourController.getATour).patch(tourController.updateATour).delete(tourController.deleteATour)


module.exports = router; 