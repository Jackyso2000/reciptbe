const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/pos.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

    app.post("/api/createPos", controller.createPos);
    app.post("/api/attachCustomer/:posid/:customerid", controller.attachCustomer);
    app.post("/api/clearCustomer", controller.clearCustomer);
    app.get("/api/getCustomer/:id", controller.getCustomer);
};
