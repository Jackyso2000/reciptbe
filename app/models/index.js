const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.receipt = require("./receipt.model");
db.shop = require("./shop.model");
db.category = require("./category.model");
db.pos = require("./pos.model");
db.item = require("./item.model");
db.loyaltycard = require("./loyaltycard.model");
db.userloyaltycard = require("./userloyaltycard.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;