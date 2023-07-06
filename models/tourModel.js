/** 
 * This is the tour data model using mongoose.
 * 1. Data models based on the MongoDB documents(built-in, customized validator, third-party).
 * 2. Virtural properties (duration(days)=>weeks)
 * 3. Mongoose middleware:
 *  a. Dcument middleware
 *  b. Query middleware
 *  c. Aggregation middleware
*/
const mongoose = require("mongoose");
const slugify = require("slugify"); //turn "Test tour" to "Test-tour"
const validator = require("validator"); // third party library: line 23
const User = require("./userModel")

//Create a schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour must have a name"],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must be at most 40 characters'],
    minlength: [10, 'A tour name must be at least 10 characters'],
    //validate: validator.isAlpha //space will be invalidat too
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
    enum:{
      values: ['easy', 'medium','difficult'],
      message: 'Difficulty can only be easy, medium or difficult'
    
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min:[1, 'Rating must be above 0'],
    max:[5, 'Rating must be below 5.0']
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
  priceDiscount:{ 
    type: Number, 

    //customized data validator: need to return a boolean 
    validate:{
      validator: function(val){
        //this points to the current document only when create new doc not when update
        return val < this.price // discount price need to be smaller than price
      },
      message: 'Discount price ({VALUE}) must be below price'


    } 
  },
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
  }, 
    startLocation:{
      //Geo Json
      type:{
        type: String,
        default: 'Point', 
        enum:['Point']
      },
      coordinates:[Number], 
      address:String, 
      description: String,
    
  },
  locations:[
    {
      type:{
        type: String, 
        default: 'Point', 
        enum:['Point']
      }, coordinates:[Number],
      address:String,
      description: String, 
      day: Number
    }
  ], 
  //guides:Array,// embed tour guide in tour
  guides: [
    {
      type: mongoose.Schema.ObjectId, 
      ref:'User' //no need to import 
    }
  ], 

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

/**
 * Virtual populate children data(reviews) to its parent(tours).
 */
tourSchema.virtual('reviews', {
  ref: 'Review', 
  foreignField: 'tour',
  localField: '_id' 

})

// Pre middleware
// Document middleware: runs before .save() and .create()
tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower: true}) // this means the current document that's being saved
  next()
})

/**
 * Embeds tour guids info into a tour when creating a new tour.
 */
// tourSchema.pre('save', async function(next){
//   const guidesPromises = this.guides.map(async id=>await User.findById(id))
//   this.guides = await Promise.all(guidesPromises)
//   next()
// })

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

tourSchema.pre(/^find/, function(next){
  this.populate({
    path: 'guides', 
    select:'-__v'
  });

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
