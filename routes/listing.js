const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema} = require('../schema.js');
const Listing = require('../model/listing.js');



// Middleware

// server side validation middlewares
const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errorMessage = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errorMessage);
    }else{
        next();
    }
}



// all - Index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListening = await Listing.find({});
    res.render('listings/index.ejs',{allListening}); 
}))


// new
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

router.post("/",validateListing,wrapAsync(async(req,res)=>{
    let listing =new  Listing(req.body.listing);
    await listing.save();
    req.flash("success","New Listing Created!");
    res.redirect('/listings');  
}))

// read - show route
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id).populate("reviews");
    if(!data){
        req.flash("error","Listing you requested for does not exists");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{data});
}))


// update
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id);
    if(!data){
        req.flash("error","Listing you requested for does not exists");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{data});
}))

router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Edited!");
    res.redirect(`/listings/${id}`);
}))


// delete
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}  = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}))

module.exports = router;