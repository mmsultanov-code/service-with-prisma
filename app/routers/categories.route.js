const categories_routes = require('express').Router()
const { CategoriesController } = require('../controllers')
const { authenticationJWT } = require('../middlewares')

categories_routes.get('/', authenticationJWT, CategoriesController.list)
categories_routes.get('/:id', authenticationJWT, CategoriesController.get_by_id)
categories_routes.post('/', authenticationJWT, CategoriesController.create)
categories_routes.patch('/:id', authenticationJWT, CategoriesController.update)
categories_routes.delete('/:id', authenticationJWT, CategoriesController.remove)

module.exports = categories_routes
