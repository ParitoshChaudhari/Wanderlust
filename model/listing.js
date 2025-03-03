const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:"https://media.istockphoto.com/id/1267262825/photo/summer-hike.jpg?s=1024x1024&w=is&k=20&c=qeepa7yAtTQBPueJqKyn6sdOfbLI-hDv7A88C8WYQKo=",
    set: (v) =>
      v === ""
        ? "https://media.istockphoto.com/id/1267262825/photo/summer-hike.jpg?s=1024x1024&w=is&k=20&c=qeepa7yAtTQBPueJqKyn6sdOfbLI-hDv7A88C8WYQKo="
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
