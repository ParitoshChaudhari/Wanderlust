const Listing = require("./model/listing.js");
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('./schema.js');
const Review = require("./model/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // Redirecting login user to url where its process was stop
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must login to create listing");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission to edit this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {reviewId,id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission to delete this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// server side validation middlewares
module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errorMessage = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errorMessage);
    }else{
        next();
    }
}

module.exports.reviewListing = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMessage = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errorMessage);
    }else{
        next();
    }
}