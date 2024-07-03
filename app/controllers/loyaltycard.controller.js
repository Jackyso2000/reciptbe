const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Receipt = db.receipt;
const Role = db.role;
const Pos = db.pos;
const Shop = db.shop;
const LoyaltyCard = db.loyaltycard;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const moment = require("moment")

exports.getAllLoyaltyCard = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    LoyaltyCard.find({
    }).populate('shop')
        .exec((err, LoyaltyCard) => {
            
      res.status(200).json({
          LoyaltyCard: LoyaltyCard,
      });
        });
    
};

exports.createLoyaltyCard = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    LoyaltyCard.create({
        shop: '613e078509d0dcab57674c16',
        benefits: ['Exclusive deals during Member Sale', '1 Free Signature Ramen for orders above $50', 'Extra 10% off on birthday meals'],
        price: [{ year: 1, price: 50 }, { year: 2, price: 80 }, { year: 3, price: 100 }]
        
    }).then(result => {
        console.log(result);
        res.status(200).json({
            result
        });
    });
    
};

exports.loyaltyCardgetById = (req, res) => {
    LoyaltyCard.findById(req.params.id).populate('shop').populate('user').then(LoyaltyCard => res.json(LoyaltyCard))
};

exports.updateLoyaltyCardById = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    console.log(req.body.id)
    LoyaltyCard.findOneAndUpdate({ _id: req.body.id }, { $inc: { 'points': 50 } }, { useFindAndModify: false }).then(LoyaltyCardResult => {
        LoyaltyCard.findById(LoyaltyCardResult._id).populate('shop').populate('user').then(LoyaltyCard => res.json(LoyaltyCard));
})
    };

