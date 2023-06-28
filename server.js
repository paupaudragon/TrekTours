/*
This is the server module using mongoose, dotenv.
1. Connects to MongoDB cloud
2. Using config file to store environment variables, such as database link and password
3. Start the server
*/

const mongoose = require('mongoose');
const dotenv = require('dotenv')
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

const app = require('./app')

console.log(app.get('env'))
// console.log(process.env)

//start the server
const port = process.env.port;
app.listen(port, () => {
  console.log("listening on 3000");
});