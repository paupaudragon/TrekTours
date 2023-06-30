const mongoose = require('mongoose')
const validator = require('validator')// third-party

//fields: name, email, photo, passwords, passwordsCOnfirm
const userSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: [true, 'User must have a name'], 
        // trim: true, 
        // maxLength: [50, 'User name must be shorter than 50 characters'], 
        // minlength: [1, 'User name must be larger than 0 character']
    }, 
    email:{
        type: String, 
        required: [true, 'User must have an email'], 
        unique: true, 
        lowercase: true, 
        validate:[validator.isEmail, 'Please provide a valid email'] //third-party check if an email is valid

    }, 
    photo:{
        type: String, 
    }, 
    password:{
        type: String, 
        required: [true, 'User must have a passsword'], 
        minlength: [8, 'Password must be at least 8 characters']
    },
    passwordConfirm:{
        type: String, 
        required: [true, 'User must confirm password'], 
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User