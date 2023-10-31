const userSession = require("../helpers/session")
const adminSession = require("../helpers/sessionAdmin")
const managerSession = require("../helpers/sessionManager")

module.exports = (app) => {
  const inventory = require("../controllers/inventory.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", userSession, inventory.create);

  // Retrieve all inventory
  router.get("/", userSession, inventory.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", userSession, inventory.findOne);

  // Update a Tutorial with id
  router.put("/:id", userSession, inventory.update);

  // Delete a Tutorial with id
  router.delete("/:id", userSession, inventory.delete);

  // Delete all Tutorial
  router.delete("/", userSession, inventory.deleteAll);

  // Delete all Tutorial by Admin
  router.delete("/deletebyadmin", adminSession, inventory.deleteAll);

  app.use('/api/inventory', router);
};