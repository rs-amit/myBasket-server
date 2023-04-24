const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema({
    title:{type:String,required:true,unique:true},
    disc:{type:String,required:true},
    img:{type:String,required:true},
    rating:{type:String},
    countInStock:{type:Number},
    catagories:{type:Array},
    price:{type:Number,required:true},
    colors:{type:Array}
},{timestamps:true})

const ProductModel = mongoose.model("Products", ProductSchema)

module.exports = { ProductModel }