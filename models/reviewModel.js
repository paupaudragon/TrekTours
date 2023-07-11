const mongoose = require("mongoose");
const Tour = require('./tourModel')
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "You have to write some review to submit"],
      trim: true,
      maxlength: [250, "Review cannot be longer than 250 characters"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// Indexing
//One user can only create one review for each tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });


//Middleware

// reviewSchema.pre(/^find/, function (next) {
//   this.find();
//   this.start = Date.now();
//   next();
// });

/**
 * Populates find reviews query to display corresponding user info.
 */
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  //console.log(stats);

  //If else if for when all the reviews are gone,set back to default
 if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post("save", function () {
  // this - current review
  this.constructor.calcAverageRatings(this.tour); // Review doesnt exist at this point, so use this.constructor
});

// findByIdAndUpdate
// findByIdAndDelete

reviewSchema.pre(/^findOneAnd/, async function(next){
  //this-current query
  this.r = await this.clone().findOne();
  //console.log(this.r);
  next()
})

reviewSchema.post(/^findOneAnd/, async function(){
  await this.r.constructor.calcAverageRatings(this.r.tour)

})

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
