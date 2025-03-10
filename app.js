const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbConnect = require('./connections/db.js');
const dotenv = require('dotenv');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listing = require('./routes/listing.js');
const review = require('./routes/review.js');
const flash = require('connect-flash');
const session = require('express-session')


dotenv.config();
app.set("view engine ","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

dbConnect();


const sessionOptions = {
    secret:"mysecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}

app.use(session(sessionOptions));
app.use(flash());


app.get("/",(req,res)=>{
    res.redirect('/listings'); 
})




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


app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// routes
app.use("/listings",listing);
app.use("/listings/:id/reviews",review);



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
