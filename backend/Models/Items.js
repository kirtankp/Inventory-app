const mongoose = require('mongoose')

//itemSchema is the schema for the items
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    category: {
        type: String,
        ref: 'Category',
        required: true,
    },
    quantity: {
        type: Number,
    },
    photo: {
        data: Buffer,
        contentType: String,
    }
},
    //itemData is the collection name in the dataBase
    { collection: 'itemData' }
)
//Item is the model name 
module.exports = mongoose.model('Item', itemSchema)