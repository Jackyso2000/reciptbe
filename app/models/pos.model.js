const mongoose = require("mongoose");

const Pos = mongoose.model(
  "pos",
  new mongoose.Schema({
      posID: String,
      username: String,
      password: String,
      shop: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'shops'
      },
      customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      },
  })
);

module.exports = Pos;
