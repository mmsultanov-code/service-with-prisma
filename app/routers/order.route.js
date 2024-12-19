const order_routes = require('express').Router()
const { OrderController } = require('../controllers')
const { authenticationJWT } = require('../middlewares')

order_routes.get('/', authenticationJWT, OrderController.list)
order_routes.get('/:id', authenticationJWT, OrderController.get_by_id)
order_routes.post('/', authenticationJWT, OrderController.create)
order_routes.patch('/:id', authenticationJWT, OrderController.update)
order_routes.delete('/:id', authenticationJWT, OrderController.remove)

module.exports = order_routes
