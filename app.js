// setup express
const express = require('express')
const app = express()

app.get('/api/v1/tours', (req, res)=>{
    
})



//start the server 
const port = 3000
app.listen(port, ()=>{
    console.log('listening on 3000')
})