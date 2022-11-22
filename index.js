const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');

// MiddleWares
app.use(cors())
app.use(express.json())

// Database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.agg0z.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// All API For CRUD Operation
async function run() {
    try{
        await client.connect()
        const booksCollection = client.db('book_info').collection('books')
        const orderCollection = client.db('book_info').collection('orders')

        // Books CRUD api
        app.get('/books', async(req, res)=>{
            const result = await booksCollection.find({}).toArray()
            res.send(result)
        })

        app.get('/book/:id', async(req, res)=>{
            const {id} = req.params;
            const result = await booksCollection.findOne({_id: ObjectId(id)})
            res.send(result)
        })

        app.post('/book', async(req, res)=>{
            const book = req.body;
            const result = await booksCollection.insertOne(book)
            res.send(result)
        })

        app.delete('/book/:id', async(req, res)=>{
            const {id} = req.params;
            const result = await booksCollection.deleteOne({_id:new ObjectId(id)})
            res.send(result)
        })

        app.put('/book/:id', async(req,res) =>{
            const updatedBook = req.body;
            const {id} = req.params;
            const updateDoc = {
                $set: updatedBook
              };
            const result = await booksCollection.updateOne({_id:new ObjectId(id)}, updateDoc, {upsert: true})
            res.send(result)
        })

        // Book Order API

        app.get('/order', async(req, res)=>{
            const OrdererEmail = req.query.email;
            const orders = await orderCollection.find({email: OrdererEmail}).toArray()
            res.send(orders)
        })

        app.post('/order', async(req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })

    }
    finally{
        // await client.close()
    }
}

run().catch(console.dir)


app.get('/', (req, res)=>{
    res.send('The Bookory Server is running')
})

app.listen(port, ()=>{
    console.log(`The Bookory running on port ${port}`);
})