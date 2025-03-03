const mongoose = require('mongoose');
const Listing = require('../model/listing.js');
const { sampleListings } = require('./data.js');


const dbConnect = async ()=>{
    try{
        const dbStatus = await mongoose.connect("mongodb+srv://admin:rcpit25@mainserver.cklv1.mongodb.net/wonderlust");
        if(dbStatus){
            console.log("DB CONNECTED...")
        }
    }catch(err){
        console.log("Error occurred in DB CONNECT" , err);
    }
}

dbConnect();


const initDb = async () => {
    try {
      await Listing.deleteMany({});
      await Listing.insertMany(sampleListings);
      console.log("Data was initialized.");
    } catch (error) {
      console.error("Error during initialization:", error);
    }
  };
  

initDb();