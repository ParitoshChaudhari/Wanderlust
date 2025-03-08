const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const {reviewSchema} = require('../schema.js');
const Listing = require('../model/listing.js');
const Review = require('../model/review.js');


// middleware
const reviewListing = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMessage = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errorMessage);
    }else{
        next();
    }
}


// Reviews
// Post
router.post("/",reviewListing, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = await Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log("new review saved", newReview);
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);
}))


// Delete review
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))


module.exports = router;