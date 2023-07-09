const Review = require("./../models/reviewModel");
const factory = require('./handlerFactory')


exports.getAllReviews = factory.getAll(Review);

  /**
   * Middleware runs before create review. Gets the tour id and user id
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  exports.setTourUserIds = (req, res, next)=>{
     //Nested routes
     if(!req.body.tour) req.body.tour = req.params.tourId; 
     if(!req.body.user) req.body.user = req.user.id;
     next()
  }
  exports.getReview = factory.getOne(Review)
  exports.createReview = factory.createOne(Review)
  exports.deleteReview = factory.deleteOne(Review)
  exports.updateReview = factory.updateOne(Review)