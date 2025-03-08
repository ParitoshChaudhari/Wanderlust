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
    res.redirect('/listings');  
}))

// read - show route
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{data});
}))


// update
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id);
    res.render("listings/edit.ejs",{data});
}))

router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))


// delete
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}  = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}))

module.exports = router;