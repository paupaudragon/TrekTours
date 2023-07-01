/*
This is a controller for user resource. 
TODO:
*/
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync (async (req, res, next)=>{
    const users = await User.find();

    // Send the data
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users: users,
      },
    });
})

exports.getAUser = (req, res)=>{
    res.status(500).json({
        status: 'error', 
        message:'TODO'
    })
}

exports.createAUser = (req, res)=>{
    res.status(500).json({
        status: 'error', 
        message:'TODO'
    })
}

exports.updateUser = (req, res)=>{
    res.status(500).json({
        status: 'error', 
        message:'TODO'
    })
}

exports.deleteUser = (req, res)=>{
    res.status(500).json({
        status: 'error', 
        message:'TODO'
    })
}
