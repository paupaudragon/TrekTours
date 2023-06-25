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

// req.params/:x/:y? defined params and optional params
app.get("/api/v1/tours/:id", (req, res) => {

    console.log(req.params)

    const tour = allTours.find((el)=>el.id === Number(req.params.id)) //also could use req.params.id *1 ti convert string to number
    if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: "not found tour"
        })
    }
    res.status(200).json({
      status: "success",
      data: {
        tours: tour,
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

//********* Patch *************
//not implememted
app.patch('/api/v1/tours/:id', (req, res)=>{

    const tour = allTours.find((el)=>el.id === Number(req.params.id)) //also could use req.params.id *1 ti convert string to number
    if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: "not found tour"
        })
    }

    res.status(200).json({
        status: 'success', 
        data: {
            tour: 'Updated'
        }
    })
})

//********* Delete *************
app.delete('/api/v1/tours/:id', (req, res)=>{

    const tour = allTours.find((el)=>el.id === Number(req.params.id)) //also could use req.params.id *1 ti convert string to number
    if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: "not found tour"
        })
    }

    res.status(204).json({
        status: 'success', 
        data: null
    })
})

//start the server
const port = 3000;
app.listen(port, () => {
  console.log("listening on 3000");
});
