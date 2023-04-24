const mongoose = require('mongoose')


const CartSchema = new mongoose.Schema({
    userId:{type:String,required:true,unique:true},
    products:[
       {
        productId:{type:String},
        quantity: {
            type: Number,
            default: 1,
          },
       }
    ]
},{timestamps:true}
)

const CartModel = mongoose.model("Carts", CartSchema)

module.exports = { CartModel } 