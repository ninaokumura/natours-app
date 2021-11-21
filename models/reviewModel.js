// review / rating / createdAt / ref to the tour / ref to the user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      defaulrt: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Preventing duplicating reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Query middleware

// Populate all docs -> this one will add some extra queries, and in this case its actually two queries (for the tours and for the user) in order to find the matching doc
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // Aggregation pipeline to create some statistics
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

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Here we should use the post instead of the pre save middleware because at this point it's not really saved yet snd it wont be able to appear in the output. Post cannot get access to next
reviewSchema.post('save', function () {
  // console.log(this);
  // This points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// FindByIdAndUpdate and findByIsAndDelete only have query middleware and not document middleware
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.rev = await this.findOne();
  // console.log(this.rev);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does not work here, query has already executed
  await this.rev.constructor.calcAverageRatings(this.rev.tour);
});

// Create the model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
