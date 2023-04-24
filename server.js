require('dotenv').config()
const cors = require('cors');
const express = require("express");
const connectDB = require("./config/db")
const orders = require('./routes/Orders')
const userRouter = require("./routes/User")
const product = require('./routes/Product')
const cart = require('./routes/Cart')
const auth = require("./routes/auth")
const checkout = require("./routes/CheckoutStripe")
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/users",userRouter)
app.use("/api/auth", auth)
app.use("/api/product", product)
app.use("/api/carts", cart)
app.use("/api/orders", orders)
app.use("/api/checkout", checkout)


const PORT = process.env.PORT || 4000

// 3rd step for deployment
if(process.env.NODE_ENV === "production"){
   app.use(express.static('frontend/build'))
}


app.listen(PORT, ()=>console.log(`server running on port ${PORT}`)) 