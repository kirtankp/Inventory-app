const mongoose = require('mongoose')
//userSchema is the schema for the users
const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String
    }
},
    //userData is the collection name in the dataBase
    { collection: 'userInventory' }
)
//User is the model name 
module.exports = mongoose.model('User', userSchema)