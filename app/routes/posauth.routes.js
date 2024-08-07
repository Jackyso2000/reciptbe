const { verifyPOSSignUp } = require("../middlewares");
const controller = require("../controllers/posauth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/posauth/signup",
    [
      verifyPOSSignUp.checkDuplicateUsername,
    ],
    controller.signup
  );

  app.post("/api/posauth/signin", controller.signin);
};
