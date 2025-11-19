const express = require('express');
const routes = express.Router();

const controller = require('../controllers/user.controller');

const authMiddleware = require('../middlewares/auth.middleware');

routes.post("/register", controller.register);

routes.post("/login", controller.login);

routes.post("/password/forgot", controller.forgotPassword);

routes.post("/password/otp", controller.otpPassword);

routes.post("/password/reset", controller.resetPassword);

routes.get("/detail", authMiddleware.requireAuth, controller.detail);

module.exports = routes;