const mongoose = require("mongoose");

//Create a schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour must have a name"],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "Tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Tour must have a maxGroupSize"],
  },
  difficulty: {
    type: String,
    required: [true, "Tour must have a difficulty"],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "Tour must have a price"],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "Tour must have a summary"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "Tour must have a image"],
  },
  images: [String], //saved as array of Strings
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, //hide data from user
  },
  startDates: [Date],
}, 
{
  toJSON:{virtuals: true}, //schema options
  toObject:{virtuals: true}
});

//virtual properties: cannot be used in a query
tourSchema.virtual("durationWeeks").get(function () {
  //only function() can provide this key word
  return this.duration / 7; // how many weeks
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
