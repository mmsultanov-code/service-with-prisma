const categories_routes = require('express').Router();
const { CategoriesController } = require('../controllers');

categories_routes.get('/', CategoriesController.list);
categories_routes.get('/:id', CategoriesController.get_by_id);
categories_routes.post('/', CategoriesController.create);
categories_routes.patch('/:id', CategoriesController.update);
categories_routes.delete('/:id', CategoriesController.remove);

module.exports = categories_routes;