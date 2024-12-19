const prisma = require('../config/prisma.config')

class OrderService {
    async list(req, res) {
        try {
            const model_data = await prisma.order.findMany()
            res.json(model_data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async get_by_id(req, res) {
        try {
            await this.check_by_id(req.params.id)
            const { id } = req.params
            const model_data = await prisma.order.findUnique({
                where: { id: parseInt(id) }
            })
            if (!model_data) return res.status(404).json({ error: 'Data not found' })
            res.json(model_data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async create(req, res) {
        try {
            await this.check_validation_fields(req.body)
            await this.check_exist_user(req.body.userId)
            await this.check_exist_product(req.body.productId)
            const { userId, productId, quantity, total } = req.body
            const model_data = await prisma.order.create({
                data: { userId, productId, quantity, total }
            })
            res.status(201).json(model_data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async update(req, res) {
        try {
            await this.check_validation_fields(req.body)
            await this.check_exist_user(req.body.userId)
            await this.check_exist_product(req.body.productId)
            await this.check_by_id(req.params.id)
            const { id } = req.params
            const { userId, productId, quantity, total } = req.body
            const model_data = await prisma.order.update({
                where: { id: parseInt(id) },
                data: { userId, productId, quantity, total }
            })
            res.json(model_data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async remove(req, res) {
        try {
            await this.check_by_id(req.params.id)
            const { id } = req.params
            await prisma.order.delete({
                where: { id: parseInt(id) }
            })
            res.status(204).send()
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async check_by_id(id) {
        const model_data = await prisma.order.findUnique({
            where: { id: parseInt(id) }
        })
        if (!model_data) {
            throw new Error('Data not found')
        }
    }

    async check_exist_user(id) {
        if (!id) {
            throw new Error('User id is required')
        }
        const model_data = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        })
        if (!model_data) {
            throw new Error('User not found')
        }
    }

    async check_exist_product(id) {
        if (!id) {
            throw new Error('Product id is required')
        }
        const model_data = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        })
        if (!model_data) {
            throw new Error('Product not found')
        }
    }

    async check_validation_fields(data) {
        if (!data.userId) {
            throw new Error('User id is required')
        }
        if (!data.productId) {
            throw new Error('Product id is required')
        }
        if (!data.quantity) {
            throw new Error('Quantity is required')
        }
        if (!data.total) {
            throw new Error('Total is required')
        }
        if (isNaN(data.quantity)) {
            throw new Error('Quantity must be a number')
        }
        if (isNaN(data.total)) {
            throw new Error('Total must be a number')
        }
        if (data.quantity <= 0) {
            throw new Error('Quantity must be greater than 0')
        }
        if (data.total <= 0) {
            throw new Error('Total must be greater than 0')
        }
        if (data.quantity > 1000) {
            throw new Error('Quantity must be less than 1000')
        }
        if (data.total > 100000000) {
            throw new Error('Total must be less than 100000000')
        }
    }
}

module.exports = new OrderService()
