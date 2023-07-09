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
const factory = require('./handlerFactory')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverge,summary,difficulty";
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getATour = factory.getOne(Tour, {path:'reviews'})
exports.createATour = factory.createOne(Tour)
exports.updateATour = factory.updateOne(Tour);
exports.deleteATour = factory.deleteOne(Tour);

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
