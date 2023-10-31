const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.create = (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      message: "Username and password are required!",
    });
    return;
  }

  const user = {
    username: req.body.username,
    role: "User",
    activation: false,
  };

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.status(500).send({
        message: "Error hashing password",
      });
      return;
    }

    user.password = hash;

    User.create(user)
      .then((data) => {
        const token = jwt.sign(
          { id: data.id, username: data.username, role: data.role },
          process.env.TOKEN_CODE,
          {
            expiresIn: "5h",
          }
        );
        res.send({ user: data, token });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message && "Some error occurred while creating the User.",
        });
      });
  });
};

exports.findAll = (req, res) => {
  const username = req.query.username;
  var condition = username
    ? { username: { [Op.iLike]: `%${username}%` } }
    : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users.",
      });
    });
};

exports.verUser = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: `Cannot toggle activation for User with id=${id}. User not found!`,
        });
      }

      const newActivationStatus = !user.activation;

      User.update({ activation: newActivationStatus }, { where: { id: id } })
        .then(() => {
          res.send({
            message: `User activation status has been toggled to ${
              newActivationStatus ? "active" : "inactive"
            }.`,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Could not toggle User activation with id=" + id,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not find User with id=" + id,
      });
    });
};
