const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class _auth {
  async login(body) {
    try {
      const { username, password } = body;

      // Find a user by username
      const user = await User.findOne({
        where: { username },
      });

      // If the user is not found
      if (!user) {
        return {
          status: false,
          statusCode: 404,
          error: "User Not Found",
        };
      }

      // Check the password
      if (!bcrypt.compareSync(password, user.password)) {
        return {
          status: false,
          statusCode: 401,
          error: "Incorrect Password",
        };
      }

      const payload = {
        id: user.id,
        username: user.username,
      };

      const token = jwt.sign(payload, process.env.TOKEN_CODE, {
        expiresIn: "5h",
      });

      return {
        status: true,
        data: { token },
      };
    } catch (error) {
      console.error("login auth module error", error);
      return {
        status: false,
        error,
      };
    }
  }

  authToken(req, res, next) {
    const authHeader = req.headers.authorization;

    try {
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.TOKEN_CODE);

        User.findByPk(decode.id)
          .then((user) => {
            if (user) {
              req.user = {
                id: user.id,
                username: user.username,
              };
              next();
            } else {
              res.sendStatus(403);
            }
          })
          .catch((error) => {
            console.error("authToken user module Errors: ", error);
            res.sendStatus(403);
          });
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      console.error("authToken user module Errors: ", error);
      res.status(403).send("Invalid token");
    }
  }
}

module.exports = new _auth();
