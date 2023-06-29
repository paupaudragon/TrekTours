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
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

//logging
const morgan = require("morgan");

// Scripts
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //tiny
}

//Express middleware
app.use(express.json()); // parsing incoming json data, or undefined
app.use(express.static(`${__dirname}/public`)); //using public folder for accessing the front-end

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//all means all verbs api(get, post, ...)
//* all urls
app.all("*", (req, res, next) => {
    next(new AppError( `Can't find ${req.originalUrl}`, 404)) //anything passed in next() will be recognized as error
});


//Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
