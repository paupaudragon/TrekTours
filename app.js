// setup express
const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.status(200).send('hello from the server side')
})



//start the server 
const port = 3000
app.listen(port, ()=>{
    console.log('listening on 3000')
})