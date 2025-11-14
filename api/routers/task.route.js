const express = require('express');
const routes = express.Router();

const controller = require('../controllers/task.controller');

routes.get("/", controller.index);

routes.get("/detail/:id", controller.detail);

module.exports = routes;