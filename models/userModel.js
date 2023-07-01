const mongoose = require("mongoose");
const validator = require("validator"); // third-party
const bcrypt = require("bcryptjs");

//fields: name, email, photo, passwords, passwordsCOnfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    // trim: true,
    // maxLength: [50, 'User name must be shorter than 50 characters'],
    // minlength: [1, 'User name must be larger than 0 character']
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"], //third-party check if an email is valid
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "User must have a passsword"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "User must confirm password"],
    validate: {
      // This only workd on create(), save()
      // If it was an update, this will not run
      validator: function (currentElement) {
        return currentElement === this.password;
      },
      message: "Passwrods are not the same",
    },
  },
  passwordChangedAt:{ type: Date} //only exists when password is changed
});

// Mongoose DOcument middleware
userSchema.pre("save", async function (next) {
  // If password not modified, return
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12); // the numbber means how intensive the cpu process will be, higher the better but slower
  this.passwordConfirm = undefined; //after checking it is correct, throw away before saving into the database
});

// Check the if the pasword is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check is the password is changed after the token is issued
userSchema.methods.changePasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        //console.log(changedTimeStamp, JWTTimestamp)
        return JWTTimestamp < changedTimeStamp 

    }
    return false
}
const User = mongoose.model("User", userSchema);
module.exports = User;
