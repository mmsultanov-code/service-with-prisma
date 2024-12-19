const prisma = require('../config/prisma.config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

class AuthService {
    SECRET_KEY = process.env.ACCESS_TOKEN_SECRET
    EXPIRES_IN = '10m'
    SALT_ROUNDS = 10
    MAX_EXPIRES_IN = process.env.MAX_EXPIRES_IN_JWT

    async login(req, res) {
        const has_token = req.headers?.authorization?.split(' ')[1]
        if (has_token) {
            return {
                status_code: 400,
                message: 'You are already logged in',
                data: {
                    token: has_token
                }
            }
        }

        const { email, password } = req.body

        if (!email || !password) {
            return {
                status_code: 400,
                message: 'Missing required fields',
                data: {
                    required_fields: ['email', 'password']
                }
            }
        }

        if (typeof email !== 'string' || typeof password !== 'string') {
            return {
                status_code: 400,
                message: 'Invalid field types',
                data: {
                    invalid_fields: ['email', 'password']
                }
            }
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            return {
                status_code: 400,
                message: 'User not found or invalid password'
            }
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return {
                status_code: 400,
                message: 'Invalid password'
            }
        }

        const token = jwt.sign({ id: user.id, email: user.email }, this.SECRET_KEY, { expiresIn: this.EXPIRES_IN })
        const refresh_token = jwt.sign({ id: user.id, email: user.email }, this.SECRET_KEY, { expiresIn: this.MAX_EXPIRES_IN })

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 1000 * 60 * 30
        })

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        return {
            status_code: 200,
            message: 'Login successful',
            data: {
                token: token
            }
        }
    }

    async register(req, res) {
        const has_token = req.headers?.authorization?.split(' ')[1]
        if (has_token) {
            return {
                status_code: 400,
                message: 'You are already logged in',
                data: {
                    token: has_token
                }
            }
        }

        const { email, password, name } = req.body

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return {
                status_code: 400,
                message: 'Invalid email format',
                data: {
                    invalid_fields: ['email']
                }
            }
        }

        if (!email || !password || !name) {
            return {
                status_code: 400,
                message: 'Missing required fields',
                data: {
                    required_fields: ['email', 'password', 'name']
                }
            }
        }

        if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
            return {
                status_code: 400,
                message: 'Invalid field types',
                data: {
                    invalid_fields: ['email', 'password', 'name']
                }
            }
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (user) {
            return {
                status_code: 400,
                message: 'User already exists'
            }
        }

        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS)
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name
            }
        })

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, this.SECRET_KEY, { expiresIn: this.EXPIRES_IN })

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 1000 * 60 * 30
        })

        return {
            status_code: 201,
            message: 'User created',
            data: {
                user: {
                    ...newUser,
                    password: undefined,
                    id: undefined
                }
            }
        }
    }

    async refresh(req, res) {
        const token = req.headers?.authorization?.split(' ')[1]

        if (!token) {
            return {
                status_code: 400,
                message: 'Missing token'
            }
        }

        try {
            const decoded = jwt.verify(token, this.SECRET_KEY)
            const newToken = jwt.sign({ id: decoded.id, email: decoded.email }, this.SECRET_KEY, { expiresIn: this.EXPIRES_IN })

            res.cookie('token', newToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'none',
                maxAge: 1000 * 60 * 30
            })

            return {
                status_code: 200,
                message: 'Token refreshed',
                data: {
                    token: newToken
                }
            }
        } catch (err) {
            return {
                status_code: 400,
                message: 'Invalid token'
            }
        }
    }

    async logout(req, res) {
        res.clearCookie('token')
        res.clearCookie('refresh_token')
        res.cookie('token', '', { maxAge: 0 })
        res.cookie('refresh_token', '', { maxAge: 0 })

        return {
            status_code: 200,
            message: 'Logged out'
        }
    }
}

module.exports = new AuthService()
