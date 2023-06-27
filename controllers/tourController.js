const Tour = require('./../models/tourModel')

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: allTours.length,
    data: {
      tours: allTours,
    },
  });
};

exports.getATour = (req, res) => {
  const tour = allTours.find((el) => el.id === Number(req.params.id));
  console.log(req.params);
  res.status(200).json({
    status: "success",
    data: {
      tours: tour,
    },
  });
};

exports.createATour = async (req, res) => {

  try {
    const newTour = await Tour.create(req.body); //MongoDb API
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

exports.updateATour = (req, res) => {
  const tour = allTours.find((el) => el.id === Number(req.params.id));

  res.status(200).json({
    status: "success",
    data: {
      tour: "Updated",
    },
  });
};

exports.deleteATour = (req, res) => {
  const tour = allTours.find((el) => el.id === Number(req.params.id));

  res.status(204).json({
    status: "success",
    data: null,
  });
};
