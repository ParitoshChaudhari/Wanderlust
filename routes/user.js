const express = require('express');
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');



// signup
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync( async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.flash("success","Welcome to wanderlust");
        res.redirect("/listings");
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
}))


// login
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",passport.authenticate('local',({failureRedirect:"/login",failureFlash:true})),wrapAsync( async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust ! You are logged in.");
    res.redirect("/listings");
}))


module.exports = router;