const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const body_parser = require('body-parser')
const cors = require('cors')

app.use(body_parser.json())
app.use(cors())

app.use(express.json());
const { user_routes, categories_routes, product_routes, order_routes, auth_routes } = require('./routers')

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/users', user_routes)
app.use('/categories', categories_routes)
app.use('/product', product_routes)
app.use('/order', order_routes)
app.use('/auth', auth_routes)
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
