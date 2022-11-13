const express = require('express');
require('dotenv').config();
const app = express()

const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('The Bookory Server is running')
})

app.listen(port, ()=>{
    console.log(`The Bookory running on port ${port}`);
})