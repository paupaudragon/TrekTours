/*
This is a controller for user resource. 
TODO:
*/
const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

/**
 * Filters an object's fields by the given allowed fields
 */
const filterObj = (obj, ...allowedfields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedfields.includes(el)) newObject[el] = obj[el];
  });

  return newObject;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // Send the data
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users: users,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next)=>{
  await User.findByIdAndUpdate(req.user.id, {active: false})
  res.status(204).json({
    status: 'success',
    data: null
  })
})


exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates, please use /updateMyPassword",
        400
      )
    );
  }

  // 2) Update user document
  // We need to prevent user change their roles. We use filter instead of req.body
  const filteredBody = filterObj(req.body, "name", "email"); // only need name and email
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data:{
        user: updatedUser,
    }
  });
});


exports.getAUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "TODO",
  });
};

exports.createAUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "TODO",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "TODO",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "TODO",
  });
};
