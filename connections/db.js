const mongoose = require('mongoose');
const dotenv = require('dotenv');

const dbConnect = async ()=>{
    try{
        const dbStatus = await mongoose.connect(process.env.MONGO_URI);
        if(dbStatus){
            console.log("DB CONNECTED...")
        }
    }catch(err){
        console.log("Error occurred in DB CONNECT" , err);
    }
}


module.exports = dbConnect;