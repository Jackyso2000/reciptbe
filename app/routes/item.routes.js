const { authJwt } = require("../middlewares");
const controller = require("../controllers/item.controller");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


module.exports = function (app) {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

  //app.use(function(req, res, next) {
  //  res.header(
  //    "Access-Control-Allow-Headers",
  //    "x-access-token, Origin, Content-Type, Accept"
  //  );
  //  next();
  //});

    app.get("/api/itemGet/:itemID", controller.getItem);
    app.get("/api/itemGetByShop/:shopID", controller.getItemByShopId);
    app.get("/api/itemGetAll", controller.getAllItem);
    app.post("/api/itemCreate", controller.createItem);
    app.post("/api/itemAdd", controller.addItem);
    app.post("/api/updateInventory", controller.updateInventory);
    app.post("/api/itemMinus", controller.minusItem);
};
