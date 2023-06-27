const Tour = require('./../models/tourModel')

exports.getAllTours = async (req, res) => {
  try{
    const allTours = await Tour.find()// to read all record, not passing any param in find()

    res.status(200).json({
      status: "success",
      results: allTours.length,
      data: {
        tours: allTours,
      },
    });
  }catch(err){
    res.status(404).json({
      status: 'fail', 
      message: err.message
    })
  }
 
};

exports.getATour = async (req, res) => {

  try{
    const tour = await Tour.findById(req.params.id) // Tour.findOne({_id: req.params.id})
    res.status(200).json({
        status: "success",
        data: {
          tours: tour,
        },
      });

  }catch(err){
    res.status(404).json({
      status: 'fail', 
      message: err.message
    })
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
      status:'fail', 
      message: err.message
    })
  }

};  

exports.updateATour = async (req, res) => {
  try{
    //mongoose API
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //return the new record
      runValidators: true
    });

    res.status(200).json({
      status: "success",
      data: {
        tour
      },
    });

  }catch (err) {
    res.status(400).json({
      status:'fail', 
      message: err.message
    })

  }
  
};

exports.deleteATour = async (req, res) => {

  try{
    await  Tour.findByIdAndDelete(req.params.id);
  
    res.status(204).json({
      status: "success",
      data: null,
    });

  }catch(err){

    res.status(400).json({
      status:'fail', 
      message: err.message
    })

  }
};
