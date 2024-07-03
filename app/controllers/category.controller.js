const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Category = db.category;
const Role = db.role;
const Pos = db.pos;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.receiptgetByMonth = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Receipt.find({
  })
        .exec((err, receipt) => {
            const array = [];
            var total = 0;
            for (let i = 0; i < receipt.length; i++) {
                const month1 = receipt[i].dateAdded.getMonth();
                if (month1 == req.params.month) {
                    array.push(receipt[i]);
                    total += receipt[i].amount;
                }
            }
      res.status(200).json({
        receipt: array,
        total:total,
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

exports.receiptgetByStore = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Receipt.find({
  })
        .exec((err, cate) => {
            const array = [];
            for (let i = 0; i < cate.length; i++) {
                array.push({ label: cate[i].name, value: cate[i]._id });
            }
            res.status(200).json({
                cate: array,
            });
        });
};


exports.getAllCategory = (req, res) => {
    Category.find().exec((err, cate) => {
        const array = [];
        for (let i = 0; i < cate.length; i++) {
            array.push({ label: cate[i].name, value: cate[i]._id });
        }
        res.status(200).json({
            cate: array,
        });
    });
    };

