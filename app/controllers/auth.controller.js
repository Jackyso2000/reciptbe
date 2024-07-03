const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    FCM:"1234567890"
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

exports.signin = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

  User.findOne({
    email: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
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

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};


exports.changePassword = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    User.findOne({
        email: req.body.username
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
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
            const filter = { email: req.body.username };
            const update = { password: bcrypt.hashSync(req.body.newPassword, 8) };

            // `doc` is the document _after_ `update` was applied because of
            // `returnOriginal: false`
            User.findOneAndUpdate(filter, update, {
                returnOriginal: false
            }).then(() => {
                res.status(200).json({
                    status : "Successfully updated!"
                });
            })


        });
};
exports.updateFCM = async(req, res) => {
  res.setHeader('Content-Type', 'application/json');
  console.log(req.body.fcm.toString())
  console.log(req.body.username)
  const docs = await User.find( { fcm: { $all: [ req.body.fcm.toString() ] } } )
  console.log(docs.length)
  if (docs.length>0){
    for (let i = 0; i < docs.length; i++) {
      User.findOneAndUpdate(
        { email: docs[i].email}, 
        { $pull: { fcm: req.body.fcm.toString() } },
       function (error, success) {
             if (error) {
                 console.log(error);
             } else {
                 //console.log(success);
             }
         });
    }

  }

  User.findOneAndUpdate(
    { email: req.body.username }, 
    { $push: { fcm: req.body.fcm  } },
   function (error, success) {
         if (error) {
             console.log(error);
         } else {
             //console.log(success);
         }
     });
 
};

exports.removeFCM = async(req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const docs = await User.find( { fcm: { $all: [ req.body.fcm.toString() ] } } )
  console.log(docs.length)
  if (docs.length>0){
    for (let i = 0; i < docs.length; i++) {
      User.findOneAndUpdate(
        { email: docs[i].email}, 
        { $pull: { fcm: req.body.fcm.toString() } },
       function (error, success) {
             if (error) {
                 console.log(error);
             } else {
                 console.log(success);
             }
         });
    }

  }
};