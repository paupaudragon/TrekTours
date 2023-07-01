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
    console.log(user)

    // send the token
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success', 
        token
    })
})