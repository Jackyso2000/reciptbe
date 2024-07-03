const mongoose = require("mongoose");

const UserLoyaltyCard = mongoose.model(
  "userloyaltycard",
  new mongoose.Schema({
      points: Number,
      expired: { type: Date },
      user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      },
    loyaltycard: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "loyaltycard"
      }
    
  })
);

module.exports = UserLoyaltyCard;
