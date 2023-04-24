require("dotenv").config()
const router = require("express").Router()
const {User} = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')


//REGISTER
router.post("/register",async(req,res)=>{
    const {username, email, password, admin} = req.body
    const newUser = new User({
        username:username,
        email:email,
        password: CryptoJS.AES.encrypt(password, process.env.SEC_PASSWORD).toString(),
        admin:admin
    })
    try{
        const registerUser = await newUser.save()
        res.status(200).json(registerUser)
        console.log("registerUser", registerUser)
    }catch(error){
        console.log("errorRegisterUser", error)
        res.status(500).json(error)

    }
})

//LOGIN
router.post("/login", async(req, res)=>{
    const {username, loginPassword} = req.body;
    if(!username && !loginPassword){
        res.status(400).json({success:false,message:"Please enter your email and password"})
    }
    const getUser = await User.findOne({username:username})
    if(!getUser){
        res.status(400).json({success:false,message:"invalid credentials"})
    }
    const hashedPassword = CryptoJS.AES.decrypt(getUser.password, process.env.SEC_PASSWORD).toString()
    if(hashedPassword === loginPassword){
        res.status(400).json({success:false,message:"invalid credentials"})
    }

    const accessToken = jwt.sign({
        id: getUser._id,
        isAdmin: getUser.isAdmin
    },process.env.JWT_SEC,
    {expiresIn: "3d"}
    )
    const {password, ...others} = getUser._doc;
    
    res.status(200).json({success:true,user:{...others,accessToken}})
   
})

module.exports = router

