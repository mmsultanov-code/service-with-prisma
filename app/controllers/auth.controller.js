const { AuthService } = require('../services')

const model = AuthService

class AuthController {
    async login(req, res) {
        const result = await model.login(req, res)
        res.json(result)
    }

    async register(req, res) {
        const result = await model.register(req, res)
        res.json(result)
    }

    async refresh(req, res) {
        const result = await model.refresh(req, res)
        res.json(result)
    }

    async logout(req, res) {
        const result = await model.logout(req, res)
        res.json(result)
    }
}

module.exports = new AuthController()
