const prisma = require('./../config/prisma.config')

class UserService {
    async list(req, res) {
        try {
            const model_data = await prisma.user.findMany()
            res.json(model_data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    
    async get_by_id(req, res) {
        try {
            await this.check_by_id(req.params.id)
            const { id } = req.params
            const model_data = await prisma.user.findUnique({
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
            await this.check_by_email(req.body.email)
            const { name, email, password } = req.body
            const model_data = await prisma.user.create({
                data: { name, email, password }
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
            const { name, email, password } = req.body
            const model_data = await prisma.user.update({
                where: { id: parseInt(id) },
                data: { name, email, password }
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
            await prisma.user.delete({
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
        const model_data = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        })
        if (!model_data) {
            throw new Error('Data not found')
        }
    }

    async check_by_email(email) {
        const model_data = await prisma.user.findUnique({
            where: { email }
        })
        if (model_data) {
            throw new Error('Email already exists')
        }
    }
}

module.exports = new UserService()