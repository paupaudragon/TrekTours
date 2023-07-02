const {promisify} = require('util');
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync"); // all async need to do this for error handling
const AppError = require('./../utils/appError')


const signToken = id=>{
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

}
exports.signUp = catchAsync(async (req, res, next) => {

    //Create a new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt, 
    role: req.body.role
  });

  //JWT 
  const token = signToken(newUser._id)

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync (async (req, res, next)=>{
    const {email, password} = req.body //varialbe name same as the property name, use destructuring

    // Check if the email and password exist
    if(!email || !password){
        return next(new AppError('Please provide email and password', 400))
    }

    // Check if user exist && password is correct 
    const user = await User.findOne({email: email}).select('+password')//explicitly select password

    if(!user || ! (await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }
    //console.log(user)

    // send the token
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success', 
        token
    })
})

exports.protect = catchAsync(async (req, res, next)=>{

    // 1. Get the token and check if it exists
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];

    }

    // 2. Validate the token 
    if(!token) {
        return next(new AppError('You are not logged in ', 401))
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3. Check if user still exist
    const freshUser = await User.findById(decoded.id)
    if(!freshUser) return next(new AppError('The user belonging to the token does not exist', 401))

    // 4. check if user change password after the token is issued
    if(freshUser.changePasswordAfter(decoded.iat)){
      return next(new AppError('User recently changed the passowrd',401))
    }

    // Grant access to the pretected 
    req.user = freshUser
    next()
})

exports.restrictTo = (...roles)=>{ //(...variable) ES6 syntax: pass multiple args to save into variable as an array of objects
  return (req, res, next)=>{
    // roles is an array [admin, lead-guide].

    //req.user is defined in last function protect
    if(!roles.includes(req.user.role)){
      return next(new AppError('You do not have the permission to perform this action', 403))
    }
    next()
  }
}