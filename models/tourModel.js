/** 
 * This is the tour data model using mongoose.
 * 1. Data models based on the MongoDB documents.
 * 2. Virtural properties (duration(days)=>weeks)
 * 3. Mongoose middleware:
 *  a. Dcument middleware
 *  b. Query middleware
 *  c. Aggregation middleware
*/
const mongoose = require("mongoose");
const slugify = require("slugify"); //turn "Test tour" to "Test-tour"

//Create a schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour must have a name"],
    unique: true,
    trim: true,
  },
  slug:{

    type: String,

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
  secretTour:{
    type: Boolean,
    default:false
  }
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

// Pre middleware
// Document middleware: runs before .save() and .create()
tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower: true}) // this means the current document that's being saved
  next()
})

// tourSchema.pre('save', function(next){
//   console.log('Will save the doc')
//   next()
// })
// tourSchema.post('save', function(doc, next){
//   console.log(doc)
//   next()

// })

// Query Middleware
// Runs before find() method
// Tour.find() is called in getAllTours
tourSchema.pre(/^find/, function(next){ //regular expression: anything started with find
  //This key word is pointed to the query
  this.find({secretTour: {$ne:true}}) //some tour doesnt have this property
  this.start = Date.now()
  next()
})

tourSchema.post(/^find/, function(docs, next){
  console.log(`Query took ${Date.now()-this.start} milliseconds`)
  //console.log(docs)
  next()
})

// Aggregation Middleware
// this = current aggragation object
tourSchema.pre('aggregate', function(next){
  this.pipeline().unshift({$match:{secretTour:{$ne:true}}}) // exclude the secret tour
  console.log(this)
  next()
})





const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
