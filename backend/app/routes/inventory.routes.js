module.exports = (app) => {
  const inventory = require("../controllers/inventory.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", inventory.create);

  // Retrieve all inventory
  router.get("/", inventory.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", inventory.findOne);

  // Update a Tutorial with id
  router.put("/:id", inventory.update);

  // Delete a Tutorial with id
  router.delete("/:id", inventory.delete);

  // Create a new Tutorial
  router.delete("/", inventory.deleteAll);

  app.use('/api/inventory', router);
};