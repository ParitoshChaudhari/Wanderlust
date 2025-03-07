const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbConnect = require('./connections/db.js');
const dotenv = require('dotenv');
const Listing = require('./model/listing.js');
const Review = require('./model/review.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('./schema.js');


dotenv.config();
app.set("view engine ","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

dbConnect();


app.get("/",(req,res)=>{
    res.redirect('/listings'); 
})


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

const reviewListing = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMessage = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errorMessage);
    }else{
        next();
    }
}

// app.get('/testListing',async(req,res)=>{
//     let listingNew = new Listing({
//         title:"rcpit ch mounatins",
//         description:"nothing good",
//         price:9000,
//         location:"Mumbai",
//         country:"India"
//     })

//     await listingNew.save();
//     console.log(listingNew)
//     res.send("data save")
// })


// all - Index route
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListening = await Listing.find({});
    res.render('listings/index.ejs',{allListening}); 
}))


// new
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings",validateListing,wrapAsync(async(req,res)=>{
    let listing =new  Listing(req.body.listing);
    await listing.save();
    res.redirect('/listings');  
}))

// read - show route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{data});
}))


// update
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id);
    res.render("listings/edit.ejs",{data});
}))

app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))


// delete
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}  = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}))


// Reviews
// Post
app.post("/listings/:id/reviews",reviewListing, wrapAsync(async(req,res)=>{
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
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))

// Middlewares
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{message});
})

app.listen(process.env.PORT || 8080, ()=>{
    console.log(`Server started on port : ${process.env.PORT}`);
})
