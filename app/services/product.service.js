const prisma = require('../config/prisma.config')

class ProductService {
    async list(req, res) {
        try {
            const model_data = await prisma.product.findMany()
            res.json(model_data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    
    async get_by_id(req, res) {
        try {
            await this.check_by_id(req.params.id)
            const { id } = req.params
            const model_data = await prisma.product.findUnique({
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
            const { name, description, price, categoryId } = req.body
            const model_data = await prisma.product.create({
                data: { name, description, price, categoryId }
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
            const { name, description, price, categoryId } = req.body
            const model_data = await prisma.product.update({
                where: { id: parseInt(id) },
                data: { name, description, price, categoryId }
            })
            res.json(model_data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    
    async remove(req, res) {
        try {
            await this.check_relationship(req.params.id)
            await this.check_by_id(req.params.id)
            const { id } = req.params
            await prisma.product.delete({
                where: { id: parseInt(id) }
            })
            res.status(204).send()
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async check_relationship(user_id) {
        const model_data = await prisma.order.findMany({
            where: { userId: parseInt(user_id) }
        })
        if (model_data.length > 0) {
            throw new Error('Data has relationship with order table')
        }
    }

    async check_by_id(id) {
        const model_data = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        })
        if (!model_data) {
            throw new Error('Data not found')
        }
    }
}

module.exports = new ProductService()