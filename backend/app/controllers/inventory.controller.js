const db = require("../models");
const Inventory = db.inventory;
const Op = db.Sequelize.Op;

// Create inventory
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  const userID = req.user.id;

  // Check if the user is verified
  if (req.user.activation !== true) {
    return res.status(403).send({
      message: "You are not authorized to create inventory. Please wait admin to verify your account.",
    });
  }

  const inventory = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    userID: userID,
  };

  Inventory.create(inventory)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Inventory.",
      });
    });
};

// Retrieve all Inventory from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  const userRole = req.user.role;

  if (userRole === 'Admin' || userRole === 'Manager') {
    Inventory.findAll({ where: condition })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Inventories.",
        });
      });
  } else {
    Inventory.findAll({ where: { userID: req.user.id, ...condition } })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Inventories.",
        });
      });
  }
};

// Find Inventory with an id

exports.findOne = (req, res) => {
  const id = req.params.id;

  Inventory.findByPk(id)
    .then((data) => {
      if (data) {
        const userRole = req.user.role;
        if (userRole === 'Admin' || userRole === 'Manager' || data.userID === req.user.id) {
          res.send(data);
        } else {
          res.status(403).send({
            message: "You do not have permission to access this inventory.",
          });
        }
      } else {
        res.status(404).send({
          message: `Cannot find Inventory with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Inventories.",
      });
    });
};

// Update a Inventory by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  const userID = req.user.id;

  Inventory.findOne({ where: { id: id, userID: userID } })
    .then((inventory) => {
      if (!inventory) {
        return res.status(404).send({
          message: `Cannot update Inventory with id=${id}. Inventory not found or you do not have permission.`,
        });
      }

      if (req.user.role === 'Admin' || inventory.userID === userID) {
        Inventory.update(req.body, { where: { id: id } })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "Inventory was updated successfully."
              });
            } else {
              res.send({
                message: `Cannot update Inventory with id=${id}. Maybe Inventory was not found or req.body is empty!`
              });
            }
          })
          .catch(err => {
            res.status(500).send({
              message: "Error updating Inventory with id=" + id
            });
          });
      } else {
        res.status(403).send({
          message: "You do not have permission to update this inventory."
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Inventory with id=" + id
      });
    });
};

// Delete a Inventory with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  const userID = req.user.id;
  Inventory.findOne({ where: { id: id } })
    .then((inventory) => {
      if (!inventory) {
        return res.status(404).send({
          message: `Cannot delete Inventory with id=${id}. Inventory not found.`,
        });
      }

      if (req.user.role === 'Admin' || inventory.userID === userID) {
        Inventory.destroy({ where: { id: id } })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "Inventory was deleted successfully!"
              });
            } else {
              res.send({
                message: `Cannot delete Inventory with id=${id}. Maybe Inventory was not found!`
              });
            }
          })
          .catch(err => {
            res.status(500).send({
              message: "Could not delete Inventory with id=" + id
            });
          });
      } else {
        res.status(403).send({
          message: "You do not have permission to delete this inventory."
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Inventory with id=" + id
      });
    });
};


// Delete all Inventorys from the database.
exports.deleteAll = (req, res) => {
  const userID = req.user.id;

  Inventory.destroy({
    where: { userID: userID },
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} inventories were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all inventories."
      });
    });
};


// Delete all inventories by Admin
exports.deleteAllByAdmin = (req, res) => {
  Inventory.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} inventories were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all inventories."
      });
    });
};

// Find all published Inventorys
exports.findAllPublished = (req, res) => {};
