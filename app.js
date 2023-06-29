/**
 * This modules adds third-party middlewares to routers.
 * 1. Logging data: morgan
 * 2. Express Json parsing middleware
 * 3. Scripts for dev or prod mode 
 * 4. Express reading static files(html, css, etc.)
 * 5. Defines the root routes for each resource
 */
const express = require("express");
const app = express();

const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');

//logging 
const morgan = require('morgan');

// Scripts
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))//tiny
}

//Express middleware
app.use(express.json()); // parsing incoming json data, or undefined
app.use(express.static(`${__dirname}/public`)) //using public folder for accessing the front-end

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

//all means all verbs api(get, post, ...)
//* all urls
app.all('*', (req,res,next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    })
})

module.exports = app;
