const fs = require("fs");
const path = require("path");

//read local data
//  - blocking
//  - json.parse to convert JSON to objects
const filePath = path.join(__dirname, "..", "data", "tours-simple.json");
const allTours = JSON.parse(fs.readFileSync(filePath));

exports.checkID = (req, res, next) => {
  const tour = allTours.find((el) => el.id === Number(req.params.id)); //also could use req.params.id *1 ti convert string to number
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "not found tour",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "missing name or price",
    });
  }
  next();
};

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

exports.createATour = (req, res) => {
  const newID = allTours[allTours.length - 1].id + 1; // last tour id+1
  const newTour = Object.assign({ id: newID }, req.body); // create a new object with json

  allTours.push(newTour);

  // can't use blocking method inside a callback
  fs.writeFile("./data/tours-simple.json", JSON.stringify(allTours), (err) => {
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  });

  console.log(req.body);
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
