const mongoose = require("mongoose");
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
    author: {
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

reviewSchema.pre(/^find/, function (next) {
  this.find();
  this.start = Date.now();
  next();
});

reviewSchema.pre(/^find/, function(next){
  this.populate({
    path: 'tour', 
    select: 'name'
  }).populate({
    path:'author', 
    select:'name photo'
  })
  next()
})
  
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
