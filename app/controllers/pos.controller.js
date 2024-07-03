const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Receipt = db.receipt;
const Role = db.role;
const Pos = db.pos;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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
exports.attachCustomer = (req, res) => {
    Pos.findOneAndUpdate({ _id: req.params.posid }, { customer: req.params.customerid }, {
        new: true
    }).then(result => {
        console.log(result);
        res.status(200).json({
            result
        });
    });
};

exports.clearCustomer = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Pos.findOneAndUpdate({ _id: req.body.pos }, { customer: undefined }, {
        new: true
    }).then(result => {
        console.log(result);
        res.status(200).json({
            result
        });
    });
};

exports.getCustomer = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Pos.findOne({ _id: req.params.id }).populate('customer').
        exec(function (err, result) {
            if (err) return handleError(err);
            var customer = result.customer
            res.status(200).json({
                customer    
            });
        });
};

