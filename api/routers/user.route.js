const express = require('express');
const routes = express.Router();

const controller = require('../controllers/user.controller');

routes.post("/register", controller.register);

routes.post("/login", controller.login);

module.exports = routes;