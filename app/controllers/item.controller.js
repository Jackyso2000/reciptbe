const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Receipt = db.receipt;
const Role = db.role;
const Shop = db.shop;
const Item = db.item;
const FormData = require('form-data');

exports.getItem = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Item.findOne({ _id: req.params.itemID })
    .then(user => res.json(user))

};

exports.getAllItem = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Item.find()
    .then(user => res.json(user))

};

exports.getItemByShopId = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Item.find({ shop: req.params.shopID })
    .then(user => res.json(user))

};

exports.createItem = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.body);
    Item.create({
        name: 'Samsung Galaxy A52',
        price: 529.90,
        sku: '456426159648946',
        count: '0',
        shop:'613e0265568eb24928dfd730'
    }).then(result => {
        res.status(200).json({
            result
        });
        console.log(result);
    });
};

exports.addItem = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var itemId = req.body.itemid;
    var plusAmount = parseInt(req.body.plus);
    Item.findOneAndUpdate({ _id: itemId }, { $inc: { 'count': plusAmount } }, { useFindAndModify: false }).then(ItemResult => {
        Item.findById(ItemResult._id).populate('shop').then(Item => res.json(Item));
    })
};

exports.minusItem = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var itemId = req.body.itemid;
    var plusAmount = parseInt(req.body.plus);
    Item.findOneAndUpdate({ _id: itemId }, { $inc: { 'count': (-plusAmount) } }, { useFindAndModify: false }).then(ItemResult => {
        Item.findById(ItemResult._id).populate('shop').then(Item => res.json(Item));
    })
};

exports.updateInventory = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var itemId = req.body.itemid;
    var newCount = parseInt(req.body.newCount);
    Item.findOneAndUpdate({ _id: itemId }, { 'count': (newCount)}, { useFindAndModify: false }).then(ItemResult => {
        Item.findById(ItemResult._id).populate('shop').then(Item => res.json(Item));
    })
};