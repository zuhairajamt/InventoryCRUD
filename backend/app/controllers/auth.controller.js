const m$auth = require("../module/auth.module");
const { Router } = require("express");

const response = require("../helpers/response");
const AuthController = Router();

// http://localhost:3000/api/login
AuthController.post("/", async (req, res) => {
  const login = await m$auth.login(req.body);
  response.sendResponse(res, login);
});


module.exports = AuthController;