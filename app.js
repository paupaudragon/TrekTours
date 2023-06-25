// setup express
const fs = require("fs");

const express = require("express");
const app = express();

//Express middleware
app.use(express.json()); // parsing incoming json data, or undefined

//read local data
//  - blocking
//  - json.parse to convert JSON to objects
const allTours = JSON.parse(fs.readFileSync("./data/tours-simple.json"));

//********* Get *************
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: allTours.length,
    data: {
      tours: allTours,
    },
  });
});

//********* Post *************
app.post("/api/v1/tours", (req, res) => {
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
});

//start the server
const port = 3000;
app.listen(port, () => {
  console.log("listening on 3000");
});
