const user_routes = require('express').Router()
const { UserController } = require('../controllers')
const { authenticationJWT } = require('../middlewares')

user_routes.get('/', authenticationJWT, UserController.list)
user_routes.get('/:id', authenticationJWT, UserController.get_by_id)
user_routes.post('/', authenticationJWT, UserController.create)
user_routes.patch('/:id', authenticationJWT, UserController.update)
user_routes.delete('/:id', authenticationJWT, UserController.remove)

module.exports = user_routes
