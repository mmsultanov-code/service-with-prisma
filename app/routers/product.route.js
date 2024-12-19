const product_routes = require('express').Router()
const { ProductController } = require('../controllers')
const { authenticationJWT } = require('../middlewares')

product_routes.get('/', authenticationJWT, ProductController.list)
product_routes.get('/:id', authenticationJWT, ProductController.get_by_id)
product_routes.post('/', authenticationJWT, ProductController.create)
product_routes.patch('/:id', authenticationJWT, ProductController.update)
product_routes.delete('/:id', authenticationJWT, ProductController.remove)

module.exports = product_routes
