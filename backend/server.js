const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const db = require("./app/models");
const dotenv = require('dotenv');
dotenv.config();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse application/json
app.use(express.json());
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// db sequelize
db.sequelize;
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// home route
app.get("/", (req, res) => {
  res.json({ message: "Server up." });
});

// Inventory route
require("./app/routes/inventory.routes")(app);

// User route
require("./app/routes/user.routes")(app);

const authController = require("../backend/app/controllers/auth.controller")
app.use("/api/login", authController)

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}.`);
});
