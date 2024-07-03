const controller = require("../controllers/userloyaltycard.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

    app.get("/api/userLoyaltyCardgetByUser/:id", controller.loyaltyCardgetByUser);
    app.get("/api/userLoyaltyCardgetByUserShop/:id", controller.loyaltyCardgetByUserShop);
    app.post("/api/updateUserLoyaltyCardById", controller.updateLoyaltyCardById);
    app.post("/api/createUserLoyaltyCard", controller.createLoyaltyCard);

};
