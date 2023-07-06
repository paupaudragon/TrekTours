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
const morgan = require("morgan");
const { request } = require("http");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require('xss-clean')
const hpp = require('hpp')

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");

// Global middleware

/**
 * Sets Security HTTP headers
 */
app.use(helmet());

/**
 * Sets logging info output in development environment
 */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //tiny
}

/**
 * Sets rate limit to 100req/IP/hour
 */
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try in an hour.",
});
app.use("/api", limiter);


//Express middleware

/**
 * Body parser: Parses data from body into req.body, size < 10kb
 */
app.use(express.json({limit: '10kb'}));

/**
 * Data sanitization again noSQL query injection
 */
app.use(mongoSanitize()); //removes $

/**
 * Sanitizes data against xss 
 */
app.use(xss())

/**
 * Prevents parameter pollution:
 * 1. ?sort=duration&sort=price, will be trimmed to the last sort
 * 2. It also damages when duration=5 & duration =9, need to use whitelist
 */
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
); 
/**
 * Serves static files
 */
app.use(express.static(`${__dirname}/public`)); //using public folder for accessing the front-end

/**
 * Test middleware
 */
app.use((req, res, next) => {
  request.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});


app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

//all means all verbs api(get, post, ...)
//* all urls
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404)); //anything passed in next() will be recognized as error
});

//Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
