const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Receipt = db.receipt;
const Role = db.role;
const Pos = db.pos;
const Shop = db.shop;
const UserLoyaltyCard = db.userloyaltycard;
const LoyaltyCard = db.loyaltycard;
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const moment = require("moment")

exports.getAllLoyaltyCard = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    UserLoyaltyCard.find({
    }).populate('loyaltycard').populate('user')
        .exec((err, LoyaltyCard) => {
            
      res.status(200).json({
          LoyaltyCard: LoyaltyCard,
      });
        });
    
};

exports.createLoyaltyCard = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var dt = new Date();
    var expiry = dt.setFullYear(dt.getFullYear()+parseInt(req.body.validity) )
    console.log(expiry)
    UserLoyaltyCard.create({
        user: req.body.userid,
        loyaltycard: req.body.loyaltycard,
        points: 0,
        expired: expiry
    }).then(result => {
        console.log(result);
        res.status(200).json({
            result
        });
    });
};

exports.loyaltyCardgetByUser = (req, res) => {
    console.log(req.params.id);
    //UserLoyaltyCard.find({ user: req.params.id }).populate('loyaltycard').populate('user').then(LoyaltyCard => res.json(LoyaltyCard))

    UserLoyaltyCard.aggregate([
        { $project: { loyaltycard: '$loyaltycard', points: '$points', expiredMonth: { $month: '$expired' }, expiredYear: { $year: '$expired' }, expiredDay: { $dayOfMonth: '$expired' },user:'$user' } },
        { $match: { user: ObjectId(req.params.id) } },
        {
            $lookup:
            {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        }, {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup:
            {
                from: "loyaltycards",
                localField: "loyaltycard",
                foreignField: "_id",
                as: "loyaltycard"
            }
        },
        {
            $unwind: {
                path: "$loyaltycard",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup:
            {
                from: "shops",
                localField: "loyaltycard.shop",
                foreignField: "_id",
                as: "loyaltycard.shop"
            }
        }, {
            $unwind: {
                path: "$loyaltycard.shop",
                preserveNullAndEmptyArrays: true
            }
        },
    ]).then(result => {
        res.send(result);
        console.log(result)
    })
        .catch(error => {
            console.log(error)
        })

};
exports.loyaltyCardgetByUserShop = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    UserLoyaltyCard.find({ user: req.params.id }).populate('loyaltycard').then(result => {
        var found = false;
        for (var x = 0; x < result.length; x++) {
            if (result[x].loyaltycard.shop == "613e0265568eb24928dfd730") {
                res.json(result[x])
                found = true;
                break;
            }
        }
        console.log(found)
        if (found == false) {
            res.json("not found")
}
    })
}
exports.updateLoyaltyCardById = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    console.log(req.params.id)
    UserLoyaltyCard.findOneAndUpdate({ _id: req.params.id }, { $inc: { 'points': 50 } }, { useFindAndModify: false }).then(LoyaltyCardResult => {
        UserLoyaltyCard.findById(LoyaltyCardResult._id).populate('loyaltycard').populate('user').then(LoyaltyCard => res.json(LoyaltyCard));
})
    };

