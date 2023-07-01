const AppError = require('./../utils/appError');

const handleJWTExpiredError = ()=>{
  return new AppError('Your token has expired. Please log in again.', 401)

}
const handleJWTError = ()=>{
  return new AppError('Invalid token, please log in again', 401)
}
const handleValidationErrorDB = err=>{
  const errors = Object.values(err.errors).map(el=>el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  const error =  new AppError(message, 400)
  console.log(error.isOperational)
  return error
}
const handleDuplicateFieldsDB = err=>{
  const field = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0]
  const message = `Duplicate field value: ${field}, Please use another value.`
  return new AppError(message, 400)
}
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  const error =  new AppError(message, 400);
  console.log("here")
  console.log(error.isOperational)
  return error
};


const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

};

module.exports = (err, req, res, next) => {
  console.log(process.env.NODE_ENV);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {

    // Third party error handling
    let error ={...err}
    if(err.name ==='CastError') {
      error = handleCastErrorDB(err);
    }
    if(err.code === 11000){
      error = handleDuplicateFieldsDB(err)
    }
    if (err.name === "ValidationError"){
      error = handleValidationErrorDB(error);

    }
    if(error.name ==='JsonWebTokenError'){
      error = handleJWTError();
    }
    if(error.name ==='TokenExpiredError'){
      error = handleJWTExpiredError()
    }
    sendErrorProd(error, res);
  }
};