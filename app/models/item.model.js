const mongoose = require("mongoose");

const Item = mongoose.model(
  "items",
  new mongoose.Schema({
    name: String,
      price: mongoose.Decimal128,
    sku: String,
      shop: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'shops'
      },
      count: Number
  })
);

module.exports = Item;
