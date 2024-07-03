const mongoose = require("mongoose");

const LoyaltyCard = mongoose.model(
  "loyaltycard",
  new mongoose.Schema({

      benefits: [{
          type: String
      }],
      price: [{
          year:
          {
              type: Number
          },
          price:
          {
              type: Number
          }
      }],
    shop: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shops"
      }
    
  })
);

module.exports = LoyaltyCard;
