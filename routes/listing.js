const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require('../controllers/listing.js');
const multer  = require('multer')
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage })


// all routes + new post 
router
  .route("/")
  .get(wrapAsync(listingController.showAllListings))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.addNewListing)
  );


// new
router.get("/new",isLoggedIn,listingController.renderNewForm)  

// show route + update route + delete route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );

// update
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderUpdateForm));


module.exports = router;