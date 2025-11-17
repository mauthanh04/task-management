const express = require('express');
const routes = express.Router();

const controller = require('../controllers/task.controller');

routes.get("/", controller.index);

routes.get("/detail/:id", controller.detail);

routes.patch("/change-status/:id", controller.changeStatus);

routes.patch("/change-multi", controller.changeMulti);

routes.post("/create", controller.create);

routes.put("/update/:id", controller.update);

module.exports = routes;