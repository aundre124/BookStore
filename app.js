import express from 'express'
import cors from 'cors'
import {PORT, mongodburl} from './config.js'
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const app = express()
app.use(cors())
app.use(express.json())

const client = new MongoClient(mongodburl,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const booksdb = client.db("myBookShop")
const myBooks = booksdb.collection("booksCollection")

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})

app.get('/', (req, res) => {
    return res.status(200).send("<h1>Fuck you<h1>")
})

app.get('/shop', (req, res) => {
    myBooks.find().toArray()
    .then(response=>{
    return res.status(200).send(response);
    })
    .catch(err=>console.log(err))

    // Route will show all books
    // return res.status(200).send('<a href="/">Home</a>');
})

app.get('/shop/:id', (req, res) => {
    // Show specific book
    const data = req.params

    const filter = {
        "_id" : new ObjectId(data.id)
    }
    
    myBooks.findOne(filter)
    .then(response=>{
    return res.status(200).send(response);
    })
    .catch(err=>console.log(err))

})

app.post('/admin/savebook', (req, res) => {
    // Add a new book
    const data = req.body
    if (!data.title)
        return res.status(400).send("No title found")
    if (!data.author)
        return res.status(400).send("No author found")
    if (!data.price)
        return res.status(400).send("No price found")

    myBooks.insertOne(data, (error, response)=>{
        if(error){
            console.log("An error occured")
            return res.sendStatus(500)
        }
    })
    return res.status(201).send(JSON.stringify(data))
})

app.delete('/admin/remove/:id', (req,res)=>{
    const data = req.params
    const filter = {
    "_id" : new ObjectId(data.id)
    }

    myBooks.deleteOne(filter)
    .then(response=>{
    return res.status(200).send(response);
    })
    .catch(err=>console.log(err))
})

app.put('/admin/update/:id', (req, res)=>{
    const data = req.params
    const docData = req.body

    const filter = {
        "_id": new ObjectId(data.id)
    }

    const updDoc = {
        $set: {
            ...docData //.data.price, Docdata.cover
        }
    }

    myBooks.updateOne(filter, updDoc)
    .then(response=>{
        return res.status(200).send(response)
    })
    .catch(err=>console.log(err))
})