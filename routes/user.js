const express = require('express');
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");


// signup
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));


// login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  );


// logout
router.get("/logout",userController.logout);

module.exports = router;