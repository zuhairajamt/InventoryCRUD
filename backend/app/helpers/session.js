const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

const userSession = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.TOKEN_CODE);
      const user = await User.findOne({
        where: {
          id: decoded.id,
        },
      });

      if (user) {
        // Define user value from token in request
        req.user = {
          id: user.id,
          username: user.username,
          role: user.role,
          activation: user.activation
        };
        next();
      } else {
        res.status(403).send({
          status: false,
          error: "Not Authorize",
        });
      }
    } catch (error) {
      console.log("UserSession middleware helpers error: ", error);
      res.status(403).send({
        status: false,
        error: "Not Authorize",
      });
    }
  }

  if (!token) {
    res.status(401).send({
      status: false,
      error: "Not Authorize, No Token",
    });
  }
};

module.exports = userSession;
