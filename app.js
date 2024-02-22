import express from 'express'

const app = express()

const PORT = 3000

app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})

app.get('/', (req, res) => {
    return res.status(232).send("<h1>Fuck you<h1>")
})

app.get('/shop', (req, res) => {
    return res.status(232).send(`<a href="/">Home</a>`);
})

app.get('/shop/:id', (req, res) => {
    const data = req.params
    res.status(262).send(`<a href="/">Book: ${data.id}</a>`)
})

