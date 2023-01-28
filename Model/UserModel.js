// Steps for creating Model instances in the database
/*
 * 1. Create StructureSchema respective to the api
* 2.  Create a new model called `User` with the given required Schema.. and Exports for use 
 */

const mongoose = require('mongoose')

/* Creating a schema for the user model. */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Please enter a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
    },
})  
/* Creating a model called `User` with the schema `UserSchema`. */
 const User = mongoose.model('User', UserSchema)
module.exports = User