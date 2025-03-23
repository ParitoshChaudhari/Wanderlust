const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbConnect = require('./connections/db.js');
const dotenv = require('dotenv');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./model/user.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');


dotenv.config();
app.set("view engine ","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

dbConnect();



const store = MongoStore.create({
    mongoUrl:process.env.MONGO_URI,
    crypto:{
        secret:process.env.STORE_SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("Error in MongoDB Session store",err)
})

const sessionOptions = {
    store,
    secret:process.env.STORE_SECRET,
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.redirect('/listings'); 
})



app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})


// routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



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
