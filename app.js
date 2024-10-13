const express = require('express')
const { connectToDb, getDb } = require('./db')

//init app & middleware
const app = express()
app.use(express.json)

//db connection
let db

connectToDb((err) => {
    if(!err) {
        app.listen(27017, () => {
            console.log('app listening on port 27017')
        })
        db = getDb()
    }
})


//routes
app.get('/books', (req, res) => {
    let books = []

    db.collection('books')
        .find()
        .sort({author:1})
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })
    res.json({mssg: "welcome to the api"})
})

app.post('/books', (req, res) => {
    const book = req.body

    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not create a new document'})
        })
})