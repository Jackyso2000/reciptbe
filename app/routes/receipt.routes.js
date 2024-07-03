const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/receipt.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

    app.get("/api/receiptgetByMonth/:month", controller.receiptgetByMonth);
    app.get("/api/receiptgetByCategory/:month/:year/:userID", controller.receiptgetByCategory);
    app.get("/api/receiptgetLatestByPos/:posID", controller.receiptgetLatestByPos);
    app.get("/api/receiptgetByStore", controller.receiptgetByStore);
    app.get("/api/receiptgetById/:id", controller.receiptgetById);
    app.get("/api/receiptgetByUser/:userId", controller.receiptgetByUser);
    app.get("/api/receipt/:userId", controller.getReceipt);
    app.post("/api/createReceipt", controller.createReceipt);
    app.post("/api/deleteReceipt", controller.deleteReceipt);
    app.post("/api/addUser/:receiptId/:userId", controller.addUser);
};
