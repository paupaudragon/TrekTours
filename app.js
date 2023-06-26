// setup express

const express = require("express");
const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//logging 
const morgan = require('morgan');


//Express middleware
app.use(express.json()); // parsing incoming json data, or undefined


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))//tiny
}

app.use(express.static(`${__dirname}/public`)) //using public folder for accessing the front-end

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app;
