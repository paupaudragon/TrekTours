const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require('./handlerFactory')


exports.getAllReviews = catchAsync(async (req, res, next) => {

    // added after nested routes
    let filter;
    if(req.params.tourId) filter ={tour: req.params.tourId}

    const reviews = await Review.find(filter); 

    res.status(200).json({
        status:'success', 
        results: reviews.length, 
        data:{
            reviews
        }
    })
  });

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