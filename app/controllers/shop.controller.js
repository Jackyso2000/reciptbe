const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Receipt = db.receipt;
const Role = db.role;
const Pos = db.pos;
const Shop = db.shop;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.getAllShops = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Shop.find({
  })
        .exec((err, shop) => {
            const array = [];
            for (let i = 0; i < shop.length; i++) {
                array.push({ label: shop[i].name, value: shop[i]._id, long: shop[i].long, lat:shop[i].lat, add:shop[i].address});
            }
      res.status(200).json({
        shop: array,
      });
        });
    
};

exports.createPos = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Pos.create({
        shop: '613e0265568eb24928dfd730',
        posID: '1'
    }).then(result => {
        console.log(result);
        res.status(200).json({
            result
        });
    });
    
};
exports.receiptgetByCategory = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Receipt.aggregate([
        { $project: { name: 1, month: { $month: '$dateAdded' },year: { $year: '$dateAdded' }, ocr: '$ocr', address: '$address',amount:'$amount',dateAdded:'$dateAdded',shop :'$shop', email:'$email' } },
        { $match: { month: parseInt(req.params.month) } },
        { $match: { year: parseInt(req.params.year) } }
        ,
            {
            $lookup:
            {
                from: "shops",
                localField: "shop",
                foreignField: "_id",
                as: "shop"
            }
        },
        {
            $unwind: {
                path: "$shop",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup:
            {
                from: "categories",
                localField: "shop.categories",
                foreignField: "_id",
                as: "categories"
            }
        }, {
            $group:
            {
                _id: { Categories: "$categories.name", color: "$categories.color" },
                
                sum: { $sum: "$amount" },
                receipts: { $push: "$_id" }
            },
        },
        {
            $unwind: {
                path: "$_id.Categories",
                preserveNullAndEmptyArrays: true
            }
        },        {
            $unwind: {
                path: "$_id.color",
                preserveNullAndEmptyArrays: true
            }
        },
        //{
        //    $lookup:
        //    {
        //        from: "receipts",
        //        localField: "receipts",
        //        foreignField: "_id",
        //        as: "receipts"
        //    }
    //    }
    //, {
    //        $unwind: {
    //            path: "$receipts",
    //            preserveNullAndEmptyArrays: true
    //        }
    //    }, //{
        //    $lookup:
        //{
        //        from: "shops",
        //        localField: "receipts.shop",
        //        foreignField: "_id",
        //        as: "receipts.shop"
        //}
        //}, {
        //    $unwind: {
        //        path: "$receipts.shop",
        //        preserveNullAndEmptyArrays: true
        //    }
        //},
    ]).then(result => {
        res.send(result);
        console.log(result)
    })
        .catch(error => {
            console.log(error)
        })
};

exports.receiptgetByStore = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Receipt.find({
  })
        .exec((err, receipt) => {
            const array = [];
            for (let i = 0; i < receipt.length; i++) {
                const store = receipt[i].shop;
                if (store == req.body.store) {
                    array.push(receipt[i]);
                }
            }
      res.status(200).json({
        receipt: array,
      });
    });
};


exports.receiptgetById = (req, res) => {
    Receipt.findById(req.params.id).populate('shop').then(receipt => res.json(receipt))
    };

