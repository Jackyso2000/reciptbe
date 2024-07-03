const mongoose = require("mongoose");

const Shop = mongoose.model(
  "shops",
  new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
      categories: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'category'
      },
    address: String,
    lat: String,
    long: String
  })
);

module.exports = Shop;
