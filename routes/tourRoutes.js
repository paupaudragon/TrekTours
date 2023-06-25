const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

//read local data
//  - blocking
//  - json.parse to convert JSON to objects
const filePath = path.join(__dirname, '..', 'data', 'tours-simple.json');
const allTours = JSON.parse(fs.readFileSync(filePath));


const getAllTours = (req, res) => {
    res.status(200).json({
      status: "success",
      results: allTours.length,
      data: {
        tours: allTours,
      },
    });
  }

  const getATour = (req, res) => {

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
  }

  const createATour = (req, res) => {
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
  }

  const updateATour = (req, res)=>{

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
}

const deleteATour = (req, res)=>{

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
}

router.route('/').get(getAllTours).post(createATour)
router.route('/:id').get(getATour).patch(updateATour).delete(deleteATour)


module.exports = router; 