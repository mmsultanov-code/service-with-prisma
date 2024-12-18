const auth_routes = require('express').Router();
const { AuthController } = require('../controllers');

auth_routes.post('/login', AuthController.login);
auth_routes.post('/register', AuthController.register);

module.exports = auth_routes;