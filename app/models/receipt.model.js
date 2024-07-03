const mongoose = require("mongoose");

const Receipt = mongoose.model(
  "receipts",
    new mongoose.Schema({
        items: [{
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'items'
            },
            count: {
                type: Number,
                
            }
        }],
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shops'
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category'
        },
      pos: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'pos'
      },
      user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      },
     ocr: String,
     isPdf: Boolean,
        file: String,
    shopName: String,
    amount: mongoose.Decimal128,
    assetPath: String,
    dateAdded: { type: Date, default: Date.now }
  })
);

module.exports = Receipt;
