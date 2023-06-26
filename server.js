const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const app = require('./app')

console.log(app.get('env'))
// console.log(process.env)

//start the server
const port = process.env.port;
app.listen(port, () => {
  console.log("listening on 3000");
});