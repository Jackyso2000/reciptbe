const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const app = express();
const multer = require('multer');

require('dotenv').config();
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const User = db.receipt;
const Shop = db.shop;
const Category = db.category;
const Pos = db.pos;
const Item = db.item;
const LoyaltyCard = db.loyaltycard;
const UserLoyaltyCard = db.userloyaltycard;

db.mongoose
    .connect(`mongodb+srv://` + process.env.USER_ID + `:` + process.env.USER_KEY + process.env.WEB_DB +`?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/:userid", (req, res) => {

    const user = User.find({user:req.params.userid}).populate({
        path: 'shop',
        populate: {
            path: 'categories'
        }
    }).populate( {
            path: 'category'
        }).populate( {
            path: 'pos'
        }).populate( {
            path: 'user'
        })
        .then(user => res.json(user))

});
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './images');
    },
    filename(req, file, callback) {
        callback(null, `${file.originalname}`);
    },
});

const upload = multer({ storage });

app.post('/api/upload', upload.array('photo', 3), (req, res) => {
    console.log('file', req.files);
    console.log('body', req.body);
    res.status(200).json({
        message: 'success!',
    });
});
// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/posauth.routes")(app);
require("./app/routes/receipt.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/pos.routes")(app);
require("./app/routes/shop.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/item.routes")(app);
require("./app/routes/loyaltycard.routes")(app);
require("./app/routes/userloyaltycard.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
    
        //    new User({
        //        email: "jakcy2000@gmail.com",
        //        ocr: "iphone 12 pro max",
        //        shop: '613e0265568eb24928dfd730',
        //        amount: 1799.00

        //    }).save(err => {
        //        if (err) {
        //            console.log("error", err);
        //        }

        //        console.log("added 'receipt' to roles collection");
        //    });
        //new Shop({
        //        name: "Apple Orchard",
        //        email: "support@apple.com",
        //        phoneNumber: "+6588888888",
        //    categories: "IT",
        //    address:"270 Orchard Rd, Singapore 238857"

        //    }).save(err => {
        //        if (err) {
        //            console.log("error", err);
        //        }

        //        console.log("added 'receipt' to roles collection");
        //    });        
        //new Category({
        //        name: "IT",
        //    shops: [ "613e02a9b2d6bd31b480127f","613e0265568eb24928dfd730"]
        //    }).save(err => {
        //        if (err) {
        //            console.log("error", err);
        //        }

        //        console.log("added 'receipt' to roles collection");
        //    });
        
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });


      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
