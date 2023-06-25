// setup express
const fs = require('fs')

const express = require('express')
const app = express()


//read local data 
//  - blocking 
//  -json.parse to convert JSON to objects
const allTours = JSON.parse(fs.readFileSync('./data/tours-simple.json'))

app.get('/api/v1/tours', (req, res)=>{

    res.status(200).json({
        status: 'success', 
        results: allTours.length,
        data: {
            tours: allTours
        }
    })
    
})



//start the server 
const port = 3000
app.listen(port, ()=>{
    console.log('listening on 3000')
})