/*
This is a Scripting module that automates data impoting and deletion
1. Reads local files into variable and use the MongoDB data model Tour to create ducuments at once.
2. Use MongoDB Api to delete documents 
3. Leverage the argv[] to specify which function to call
*/
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');


const dotenv = require('dotenv')
const Tour = require('./../models/tourModel')
dotenv.config({path: './config.env'})


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD)

//change DB to DATABASE_LOCAL if want to use local database
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(con=>{
  // console.log(con.connections)
  console.log('DB connection established')
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));

const importData = async()=>{
    try{
        await Tour.create(tours)
        console.log('Data successfully loaded')
    }catch(err){
        console.log(err)
    }
    process.exit()

}

//Delete Data
const deleteData = async()=>{
    try{
        await Tour.deleteMany()
        console.log('Data successfully deleted')
    }catch(err){
        console.log(err)
    }
    process.exit()
}


//command line: 
//<node data/import-dev-data.js --import>
//<node data/import-dev-data.js --delete>

if(process.argv[2]  ==='--import'){
    importData()
}else if(process.argv[2] ==='--delete'){
    deleteData()
}
console.log(process.argv)