const order_routes = require('express').Router();
const { OrderController } = require('../controllers');

order_routes.get('/', OrderController.list);
order_routes.get('/:id', OrderController.get_by_id);
order_routes.post('/', OrderController.create);
order_routes.patch('/:id', OrderController.update);
order_routes.delete('/:id', OrderController.remove);

module.exports = order_routes;