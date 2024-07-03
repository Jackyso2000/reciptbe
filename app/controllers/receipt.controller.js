const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Receipt = db.receipt;
const Role = db.role;
const Shop = db.shop;
const Item = db.item;

let fs = require('fs');
let path = require('path');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
//import AWS from 'aws-sdk'
const request = require('request')
//const S3 = new AWS.S3()
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var html_to_pdf = require('html-pdf-node');
let ejs = require('ejs');
exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (req.body.roles) {
            Role.find(
                {
                    name: { $in: req.body.roles }
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send({ message: "User was registered successfully!" });
                    });
                }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({ message: "User was registered successfully!" });
                });
            });
        }
    });
};

exports.receiptgetByMonth = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Receipt.find({
    })
        .exec((err, receipt) => {
            const array = [];
            var total = 0;
            for (let i = 0; i < receipt.length; i++) {
                const month3 = receipt[i].dateAdded.getMonth();
                if (month3 == req.params.month) {
                    array.push(receipt[i]);
                    total += receipt[i].amount;
                }
            }
            res.status(200).json({
                receipt: array,
                total: total,
            });
        });

};

exports.getReceipt = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Receipt.find({ user: req.params.userId }).populate({
        path: 'shop',
        populate: {
            path: 'categories'
        }
    }).populate({
        path: 'pos'
    }).populate({
        path: 'user'
    })
        .then(user => res.json(user))
};

exports.deleteReceipt = (req, res) => {
    res.setHeader('Content-Type', 'application/json');


    Receipt.deleteOne({ _id: req.body.id }).then(user => res.json(user))

};

exports.receiptgetById = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Receipt.findOne({ _id: req.params.id }).populate({
        path: 'shop',
        populate: {
            path: 'categories'
        }
    }).populate({
        path: 'pos'
    }).populate({
        path: 'user'
    }).then(user => res.json(user))
};

exports.receiptgetByUser = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Receipt.find({ user: req.params.userId }).populate({
        path: 'shop',
        populate: {
            path: 'categories'
        }
    }).populate({
        path: 'pos'
    }).populate({
        path: 'user'
    }).then(user => res.json(user))
};

exports.receiptgetLatestByPos = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Receipt.find({ pos: req.params.posID }).sort({ $natural: -1 }).limit(1).populate({
        path: 'shop',
        populate: {
            path: 'categories'
        }
    }).populate({
        path: 'pos'
    }).populate({
        path: 'user'
    }).exec((err, receipt) => {
        res.status(200).json({
            receipt
        });
    });

};

// Example of options with args //
// let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };
//let template = fs.readFileSync(path.resolve(__dirname, "../template.html"), 'utf8');
//let html = ejs.render(template, { title: "test" });
//let file = { content: html };

exports.createReceipt = (req, res) => {
    
    var promise = new Promise((resolve, reject) => {
        return request({ url: 'http://www.africau.edu/images/default/sample.pdf', encoding: null },
            function (err, res, body) {

                if (err)
                    return reject({ status: 500, error: err })

                return resolve({ status: 200, body: body })
            })
    })

    promise.then((pdf) => {

        if (pdf.status == 200) {
            console.log('uploading file..')

            s3.putObject({
                Bucket: "recipt-app",
                Body: pdf.body,
                Key: 'my-pdf.pdf',
                ACL: 'public-read'
            }, (err, data) => {
                if (err)
                    console.log(err)
                else
                    console.log('uploaded')
            })
        }
    })
    var amount = 0;

    var shop;
    var file;
    // or //
    //let file = { url: "https://example.com" };
    function addZero(i) {
        if (i < 10) { i = "0" + i }
        return i;
    }

    res.setHeader('Content-Type', 'application/json');
    if (req.body.isPdf == "true") {
        console.log("running");
        console.log("isPDF");
        console.log("itemList++" + req.body.items);
        console.log(req.body.user);
        Shop.findOne({ _id: req.body.shop }).then(results => {

            var m = new Receipt;
            m.shop = req.body.shop;
            m.user = req.body.user;
            m.ocr = req.body.ocr
            m.amount = req.body.amount
            m.isPdf = req.body.isPdf
            m.pos = "615c330986575c447c835d4b"
            m.category = results.categories._id
            m.assetPath = req.body.assetPath
            m.items = JSON.parse(req.body.items)
                m.save(
                ).then(result => {
                    console.log(result);
                    console.log(req.body.isPdf);

                    var receipt = result;
                    var itemArray = [];
                    for (var x = 0; x < result.items.length; x++) {
                        const count1 = result.items[x].count;
                        console.log(count1);
                        Item.findOne({ _id: result.items[x].item }).then(results => {

                            itemArray.push({ item: results, count: count1 })
                            amount += parseFloat((Math.round(parseFloat(results.price * count1) * 100) / 100).toFixed(2));
                        })
                    }
                    Shop.findOne({ _id: req.body.shop }).then(result => {
                        const d = new Date();
                        let h = addZero(d.getHours());
                        let m = addZero(d.getMinutes());
                        let s = addZero(d.getSeconds());
                        let time = h + ":" + m + ":" + s;

                        shop = result;
                        let options = { format: 'A4', path: './receipts/' + receipt._id + '.pdf' };
                        file = {
                            content: "<html style=\"font-family: sans-serif;font-size:12;\"><h3 style=\"text-align:center;font-size:16\">" + result.name + "</h3>" + "<h3 style=\"text-align:center\">" + result.address + "</h3>" + "<h3 style=\"text-align:center\">" + result.email + "\t" + result.phoneNumber + "</h3><h3 style=\"text-align:center\">Date: " + d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + "<span style=\"display: inline-block;margin-left: 40px;\"></span>" + time + " </h3>" + "    <div style=\" margin: auto;width:91%\"><div style = \"width:45%;display: inline-block; padding: 1rem 1rem;vertical- align: middle;\">  <h3 style=\"text-align:left\">QTY<span style=\"display: inline-block;margin-left: 20px;\"></span>ITEM NAME</h3> </div><div style=\"width:45%;display: inline-block; padding: 1rem 1rem;vertical- align: middle;\"><h3 style=\"text-align:right\">PRICE</h3></div></div>" + "<hr size=\"2\" width=\"90%\" color=\"black\">  " + itemArray.map(x =>
                                "    <div style=\" margin: auto;width:90%\"><div style = \"width:80%;display: inline-block; padding: 1rem 1rem;vertical- align: middle;\">  <h3 style=\"text-align:left\">" + x.count + "<span style=\"display: inline-block;margin-left: 20px;\"></span>" + x.item.name + "</h3> </div><div style=\"width:10%;display: inline-block; padding: 1rem 1rem;vertical- align: middle;\"><h3 style=\"text-align:right\">" + "$" + (Math.round(parseFloat(x.item.price * x.count) * 100) / 100).toFixed(2) + "</h3></div></div>").join('') + "<hr size=\"2\" width=\"90%\" color=\"black\"><div style=\" margin: auto;width:90%\"><div style = \"width:45%;display: inline-block; padding: 1rem 1rem;vertical- align: middle;\">  <h3 style=\"text-align:left\">Total</h3> </div><div style=\"width:45%;display: inline-block; padding: 1rem 1rem;vertical- align: middle;\"><h3 style=\"text-align:right\">" + "$" + req.body.amount + "</h3></div></div>"
                        };
                        html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
                            console.log("PDF Buffer:-", pdfBuffer);
                            console.log("item" + JSON.stringify(itemArray[0]))
                            console.log(amount)

                        });
                    });

                    res.status(200).json({
                        result
                    });

                });
        })
    }
    else {
        if (req.body.shopName!=null) {
            var m = new Receipt;
            m.shopName = req.body.shopName;
            m.user = req.body.user;
            m.ocr = req.body.ocr
            m.amount = req.body.amount
            m.isPdf = req.body.isPdf
            m.pos = "615c330986575c447c835d4b"
            m.category = req.body.category
            m.dateAdded = req.body.dateAdded
            m.assetPath = req.body.assetPath
            m.items = req.body.items
            m.save(
            ).then(result => {

                res.status(200).json({
                    result
                });

            });
        } else {
            console.log("loglog", req.body.shop);
            Shop.findOne({ _id: req.body.shop }).then(results => {
                var m = new Receipt;
                m.shop = req.body.shop;
                m.user = req.body.user;
                m.ocr = req.body.ocr
                m.amount = req.body.amount
                m.isPdf = req.body.isPdf
                m.dateAdded = req.body.dateAdded
                m.pos = "615c330986575c447c835d4b"
                m.category = results.categories._id
                m.assetPath = req.body.assetPath
                m.items = req.body.items
                m.save(
                ).then(result => {

                    res.status(200).json({
                        result
                    });

                });
            })}
    }
            
};
exports.addUser = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Receipt.findOneAndUpdate({ _id: req.params.receiptId }, { user: req.params.userId }).then(result => {
        console.log(result);
        res.status(200).json({
            result
        });
    });
};
exports.receiptgetByCategory = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(ObjectId(req.params.userID));
    Receipt.aggregate([
        { $project: { name: 1, month: { $month: '$dateAdded' }, year: { $year: '$dateAdded' }, ocr: '$ocr', user:'$user', address: '$address', amount: '$amount', dateAdded: '$dateAdded', shop: '$shop', email: '$email', category:'$category' } },
        { $match: { user: ObjectId(req.params.userID) } },
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
                localField: "category",
                foreignField: "_id",
                as: "categories"
            }
        }
        , {
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
        }, {
            $unwind: {
                path: "$_id.color",
                preserveNullAndEmptyArrays: true
            }
        },
        //////{
        //////    $lookup:
        //////    {
        //////        from: "receipts",
        //////        localField: "receipts",
        //////        foreignField: "_id",
        //////        as: "receipts"
        //////    }
        //////    }
        //////, {
        //////        $unwind: {
        //////            path: "$receipts",
        //////            preserveNullAndEmptyArrays: true
        //////        }
        //////    }, //{
        //////    $lookup:
        //////{
        //////        from: "shops",
        //////        localField: "receipts.shop",
        //////        foreignField: "_id",
        //////        as: "receipts.shop"
        //////}
        //////}, {
        //////    $unwind: {
        //////        path: "$receipts.shop",
        //////        preserveNullAndEmptyArrays: true
        //////    }
        //////},
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


//exports.receiptgetById = (req, res) => {
//    Receipt.findById(req.params.id).populate('shop').then(receipt => res.json(receipt))
//    };

