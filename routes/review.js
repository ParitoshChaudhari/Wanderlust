const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../model/listing.js');
const Review = require('../model/review.js');
const reviewController = require('../controllers/review.js');
const {reviewListing,isLoggedIn,isReviewAuthor } = require("../middleware.js");


// Reviews
// Post
router.post(
  "/",
  isLoggedIn,
  reviewListing,
  wrapAsync(reviewController.addReview)
);


// Delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);


module.exports = router;