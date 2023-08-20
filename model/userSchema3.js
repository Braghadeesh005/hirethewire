//Product Image Schema


const mongoose=require('mongoose')
const { Schema } = mongoose;

const userSchema= new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    core: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    avatar: {
        type: String,
        required:true
      },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    filename: { 
        type: String, 
        required: true, 
        unique: true 
    },
    originalName: { 
        type: String, 
        required: true 
    },
    path: { 
        type: String, 
        required: true 
    },
    created: { 
        type: Date, 
        default: Date.now 
    },
})



//exporting Schema to auth.js

const User3 = mongoose.model('PRODUCT', userSchema);

module.exports = User3;