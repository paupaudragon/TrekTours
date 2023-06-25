// setup express
const fs = require("fs");

const express = require("express");
const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//logging 
const morgan = require('morgan');


//Express middleware
app.use(express.json()); // parsing incoming json data, or undefined

app.use(morgan('tiny'))//tiny

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

//start the server
const port = 3000;
app.listen(port, () => {
  console.log("listening on 3000");
});
