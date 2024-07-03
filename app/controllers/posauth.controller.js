const config = require("../config/auth.config");
const db = require("../models");
const User = db.pos;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    console.log("Doing");
  const user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
      res.send({ message: "User was registered successfully!" });

  });
};

exports.signin = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).json({
        id: user._id,
          username: user.username,
          shop: user.shop,
        accessToken: token
      });
    });
};
