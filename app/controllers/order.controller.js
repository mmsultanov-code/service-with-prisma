const { OrderService } = require('../services')

const model = OrderService

class OrderController {
    async list(req, res) {
        const result = await model.list(req, res)
        res.json(result)
    }

    async get_by_id(req, res) {
        const result = await model.get_by_id(req, res)
        res.json(result)
    }

    async create(req, res) {
        const result = await model.create(req, res)
        res.json(result)
    }

    async update(req, res) {
        const result = await model.update(req, res)
        res.json(result)
    }

    async remove(req, res) {
        await model.remove(req, res)
    }
}

module.exports = new OrderController()
