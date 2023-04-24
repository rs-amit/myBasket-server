const router = require('express').Router()
const { OrderModel } = require('../models/Order');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./VerifyToken");

//CREATE
router.post('/', verifyTokenAndAdmin, async(req, res)=>{
    const newOrder = new OrderModel(req.body)
    try{
        const saveOrder = await newOrder.save()
        res.status(200).json({success:true , data:saveOrder})
    }catch(error){
        res.status(500).json({success:false , error})
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
     const updatedOrder = await OrderModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
    
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  });

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        await OrderModel.findByIdAndDelete(req.params.id)
        res.status(200).json({success:true, message:"Order has been deleted..."})
    }catch(error){
        res.status(500).json({success:false, error})
    } 
})

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAdmin, async(req, res)=>{
    try{
       const getOrders = await OrderModel.find({userId : req.params.userId})
        res.status(200).json({success:true, Order:getOrders })
    }catch(error){
        res.status(500).json({success:false, error})
    } 
})

//GET ALL 
router.get("/", verifyTokenAndAdmin, async(req, res)=>{
    try{
     const orders = await OrderModel.find();
     res.status(200).json({success:true, data: orders})
    }catch(error){
     res.status(500).json({success:false, data: error})
    }
})

//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await OrderModel.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json({success:true, data:income});
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router
