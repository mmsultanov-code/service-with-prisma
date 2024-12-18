class AuthController {
    async login(req, res) {
        res.send('Login logic');
    }
    
    async register(req, res) {
        res.send('Register logic');
    }
}

module.exports = new AuthController();