const userSession = require("../helpers/session")
const adminSession = require("../helpers/sessionAdmin")
const managerSession = require("../helpers/sessionManager")

module.exports = (app) => {
  const user = require("../controllers/user.controller.js");

  var router = require("express").Router();

  router.post("/", user.create);
  router.get("/", managerSession, user.findAll);
  router.get("/:id", adminSession, user.findOne);

  router.put("/:id", userSession, (req, res, next) => {
    if (req.user.id !== parseInt(req.params.id) || req.user.role === "admin") {
      res.status(403).send({
        status: false,
        error: "Not Authorized",
      });
    } else {
      next(); 
    }
  }, user.update);

  router.delete("/:id", userSession, (req, res, next) => {
    if (req.user.id !== parseInt(req.params.id) || req.user.role === "admin") {
      res.status(403).send({
        status: false,
        error: "Not Authorized",
      });
    } else {
      next(); 
    }
  }, user.delete);

  router.delete("/", adminSession, user.deleteAll);

  router.put("/activation/:id", adminSession, user.verUser);

  app.use('/api/user', router);
};