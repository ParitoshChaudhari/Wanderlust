const Listing = require('../model/listing.js');

// all listings
module.exports.showAllListings = async(req,res)=>{
    const allListening = await Listing.find({});
    res.render('listings/index.ejs',{allListening}); 
};

// new 
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.addNewListing = async(req,res)=>{
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success","New Listing Created!");
    res.redirect('/listings');  
};


// show
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!data) {
      req.flash("error", "Listing you requested for does not exists");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { data });
};


// update
module.exports.renderUpdateForm = async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id);
    if(!data){
        req.flash("error","Listing you requested for does not exists");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{data});
};

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Edited!");
    res.redirect(`/listings/${id}`);
};


// delete
module.exports.deleteListing = async(req,res)=>{
    let {id}  = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};