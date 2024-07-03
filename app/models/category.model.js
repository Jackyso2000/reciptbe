const mongoose = require("mongoose");

const Category = mongoose.model(
  "category",
  new mongoose.Schema({
    name: String,
    color: String,
      shops: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'shops'
      }]
  })
);

module.exports = Category;
