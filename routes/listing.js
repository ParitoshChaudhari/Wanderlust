const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../model/listing.js');
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");


// all - Index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListening = await Listing.find({});
    res.render('listings/index.ejs',{allListening}); 
}))


// new
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
})

router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
    let listing =new  Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success","New Listing Created!");
    res.redirect('/listings');  
}))

// read - show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!data) {
      req.flash("error", "Listing you requested for does not exists");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { data });
  })
);


// update
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id);
    if(!data){
        req.flash("error","Listing you requested for does not exists");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{data});
}))

router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Edited!");
    res.redirect(`/listings/${id}`);
}))


// delete
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}  = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}))

module.exports = router;