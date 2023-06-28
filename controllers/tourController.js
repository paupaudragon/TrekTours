const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverge,summary,difficulty";
  next();
};


exports.getAllTours = async (req, res) => {
  try {

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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getATour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); // Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: "success",
      data: {
        tours: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createATour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body); //MongoDb API: will ignore the data not modeled in the tourModel
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateATour = async (req, res) => {
  try {
    //mongoose API
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //return the new record
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteATour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTourStats = async (req, res)=>{

  try{
    const stats = await Tour.aggregate([
      {
        $match:{ratingsAverage:{$gte: 4.5}}
      }, 
      {
        $group:{
          _id: {$toUpper: '$difficulty'}, //group by difficulty, duration..
          numRatings:{$sum: '$ratingsQuantity'},
          numTours:{$sum: 1}, // each document increment by 1
          avgRating: {$avg: '$ratingsAverage'}, // do average on ratingsAverage
          avgPrice:{$avg: '$price'},
          minPrice:{$min: '$price'},
          maxPrice:{$max: '$price'},
        }
      },
      {
        $sort:{avgPrice:1} //sort by avgPrice, 1 means acending
      }, 
      // {
      //   $match:{
      //     _id:{$ne: 'EASY'}
      //   }
      // }
    ])

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });

  }catch(err){

    res.status(400).json({
      status: "fail",
      message: err.message,
    });

  }

}