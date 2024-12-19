const auth_routes = require('express').Router()
const { AuthController } = require('../controllers')

auth_routes.post('/login', AuthController.login)
auth_routes.post('/register', AuthController.register)
auth_routes.post('/refresh', AuthController.refresh)
auth_routes.post('/logout', AuthController.logout)

module.exports = auth_routes
