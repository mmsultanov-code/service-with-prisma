const user_routes = require('express').Router();
const { UserController } = require('../controllers');

user_routes.get('/', UserController.list);
user_routes.get('/:id', UserController.get_by_id);
user_routes.post('/', UserController.create);
user_routes.patch('/:id', UserController.update);
user_routes.delete('/:id', UserController.remove);

module.exports = user_routes;