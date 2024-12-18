const product_routes = require('express').Router();
const { ProductController } = require('../controllers');

product_routes.get('/', ProductController.list);
product_routes.get('/:id', ProductController.get_by_id);
product_routes.post('/', ProductController.create);
product_routes.patch('/:id', ProductController.update);
product_routes.delete('/:id', ProductController.remove);

module.exports = product_routes;