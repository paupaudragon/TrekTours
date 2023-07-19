const crypto = require('crypto'); // node built-in
const mongoose = require("mongoose");
const validator = require("validator"); // third-party
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
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
    default: "default.jpeg"
  },
  role:{
    type: String,
    enum: ["admin", "user", "guide", "lead-guide"],
    default: 'user'
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
  passwordChangedAt:{ type: Date}, //only exists when password is changed
  passwordResetToken: String, 
  passwordResetExpires: Date, 
  active:{
    type: Boolean, 
    default: true, 
    select: false
  }
});


//=====================================================================
// Mongoose Document middleware

/**
 * Saves the hashed password to database.
 * @method: Any funtions that have save() or create()
 */
userSchema.pre("save", async function (next) {
  // If password not modified, return
  if (!this.isModified("password")) return next();

  this.password =  await bcrypt.hash(this.password, 12); // the numbber means how intensive the cpu process will be, higher the better but slower
  this.passwordConfirm = undefined; //after checking it is correct, throw away before saving into the database
  next();
});

/**
 * Saves the password changed time into database, if there is any.
 * @method: Any funtions that have save() or create()
 */
userSchema.pre('save', function(next){
  if(!this.isModified('password') || this.isNew) return next();
  
  this.passwordChangedAt = Date.now() - 1000 //offset 1 sec 
  next()

})

// Mongoose Query Middleware

/**
 * Selects all documents, whose active filed is not false.
 * @method: Any query started with "find"
 */
userSchema.pre(/^find/, function(next){
  this.find({active:{$ne:false}})
  next()
})

//======================================================================

/**
 * Checks if the password is correct when logging in.
 * @param {String} candidatePassword 
 * @param {String} userPassword 
 * @returns true if the password is correct; otherwise, false.
 */
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Checks if the token is generated after the passwrod is changed.
 * @param {Date} JWTTimestamp 
 * @returns true if the token is generated BEFORE the passwrod; otherwise false.
 */
userSchema.methods.changePasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        //console.log(changedTimeStamp, JWTTimestamp)
        return JWTTimestamp < changedTimeStamp 

    }
    return false
}

/**
 * Creates the password reset token, and change the password reset expiration date to 10 minutes from now.
 * @returns the reset token.
 */
userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //console.log({resetToken}, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 *60 * 1000

  return resetToken;
}




const User = mongoose.model("User", userSchema);
module.exports = User;
