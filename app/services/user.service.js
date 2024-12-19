const prisma = require('./../config/prisma.config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

class UserService {
    SECRET_KEY = process.env.ACCESS_TOKEN_SECRET
    EXPIRES_IN = '1h'
    SALT_ROUNDS = 10

    async list(req, res) {
        try {
            const model_data = await prisma.user.findMany()
            model_data.map((data) => delete data.password)
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
            delete model_data.password
            res.json(model_data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async create(req, res) {
        try {
            const { name, email, password } = req.body
            await this.check_by_email(email)
            const model_data = await prisma.user.create({
                data: { name, email, password: await bcrypt.hash(password, this.SALT_ROUNDS) }
            })
            delete model_data.password
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
                data: { name, email, password: await bcrypt.hash(password, this.SALT_ROUNDS) }
            })
            delete model_data.password
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
