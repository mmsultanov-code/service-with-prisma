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
}

module.exports = new OrderService()