/*
This is a controller for the tour resource.
1. Tour aliasing 
2. CRUD of tours
3. Aggregations:
    a. Tour stats
    b. Monthly plan data
*/
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverge,summary,difficulty";
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  //Execute the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // Send the data
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

/**
 * Gets a tour by id and show full guides info(name, email,..)
 */
exports.getATour = catchAsync(async (req, res, next) => {
   // Tour.findOne({_id: req.params.id})
  const tour = await Tour.findById(req.params.id).populate('reviews');

  if(!tour){
    return next(new AppError('No tour found with that id', 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      tours: tour,
    },
  });
});

/**
 * Calls catchAsync(), passing an async function into it.
 * The async function will return promise. If rejected, catchAsync() will catch the error; if not next().
 */
exports.createATour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body); //MongoDb API: will ignore the data not modeled in the tourModel
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.updateATour = catchAsync(async (req, res, next) => {
  //mongoose API
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //return the new record
    runValidators: true,
  });

  if(!tour){
    return next(new AppError('No tour found with that id', 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.deleteATour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if(!tour){
    return next(new AppError('No tour found with that id', 404))
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" }, //group by difficulty, duration..
        numRatings: { $sum: "$ratingsQuantity" },
        numTours: { $sum: 1 }, // each document increment by 1
        avgRating: { $avg: "$ratingsAverage" }, // do average on ratingsAverage
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 }, //sort by avgPrice, 1 means acending
    },
    // {
    //   $match:{
    //     _id:{$ne: 'EASY'}
    //   }
    // }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates", //spread the element of an array
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" }, //group by month
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" }, //push into an array
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0, // not projected
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
