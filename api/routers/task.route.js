const express = require('express');
const routes = express.Router();

const controller = require('../controllers/task.controller');

routes.get("/", controller.getAllTasks);

routes.get("/detail/:id", controller.getTaskById);

module.exports = routes;