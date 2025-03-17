const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require('../controllers/listing.js');


// all - Index route
router.get("/",wrapAsync(listingController.showAllListings));

// new
router.get("/new",isLoggedIn,listingController.renderNewForm)
router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.addNewListing))

// read - show route
router.get("/:id", wrapAsync(listingController.showListing));

// update
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderUpdateForm));
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));


// delete
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;