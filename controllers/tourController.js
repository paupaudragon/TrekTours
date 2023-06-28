const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    //console.log(req.query); //{ duration: { gte: '5' }, difficulty: 'easy' }

    //Build the query

    // 1)Filtering
    const queryObj = { ...req.query }; //create a new object
    const excludeFields = ["page", "sort", "limit", "fields"]; //depends on developer's implementation
    excludeFields.forEach((el) => delete queryObj[el]);
    //console.log(queryObj)

    // 2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);

    //replace gte, gt, lte, lt with $ in front
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr))

    //find methos returns a query
    let query = Tour.find(JSON.parse(queryStr)); // to read all record, not passing any param in find()

    // 3) Sorting 
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ')
      //console.log(sortBy)
      query = query.sort(sortBy)
    }
    //default sorting
    else{
      query = query.sort('-ratingsQuantity')
    }

    // 4) Field limiting
    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    }else{
      query = query.select('-__v')//- means excluding
    }

    //Execute the query
    const tours = await query;

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
