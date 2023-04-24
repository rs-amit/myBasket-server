require("dotenv").config()
const mongoose = require("mongoose")

const connectDB = async() => {
    try{
     await mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
     })
     console.log("mongoDB connected SUCCESS")
    }catch(error){
     console.error("mongoDB connected FAIL")
     process.exit(1)
    }
}

module.exports = connectDB;