const router = require('express').Router()
const {CartModel} = require('../models/Carts');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./VerifyToken");

//CREATE
router.post('/', verifyToken, async(req, res)=>{
    const newCart = new CartModel(req.body)
    try{
        const saveCart = await newCart.save()
        res.status(200).json({success:true , data:saveCart})
    }catch(error){
        res.status(500).json({success:false , error})
    }
})

//UPDATE
router.put("/:id", verifyToken, async (req, res) => {

    try {
     const updatedCart = await CartModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
    
      res.status(200).json({ success: true, data: updatedCart });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  });

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async(req, res)=>{
    try{
        await CartModel.findByIdAndDelete(req.params.id)
        res.status(200).json({success:true, message:"Cart has been deleted..."})
    }catch(error){
        res.status(500).json({success:false, error})
    } 
})

//GET CART
router.get("/find/:userId", verifyTokenAndAuthorization, async(req, res)=>{
    try{
       const getCart = await CartModel.findOne({userId : req.params.userId})
        res.status(200).json({success:true, cart:getCart })
    }catch(error){
        res.status(500).json({success:false, error})
    } 
})

//GET ALL 
router.get("/", verifyTokenAndAdmin, async(req, res)=>{
    try{
     const carts = await CartModel.find();
     res.status(200).json({success:true, data: carts})
    }catch(error){
     res.status(500).json({success:false, data: error})
    }
})

module.exports = router
