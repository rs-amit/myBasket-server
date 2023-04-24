const router = require('express').Router()
const {ProductModel} = require('../models/Products');
const { verifyTokenAndAdmin } = require("./VerifyToken");

//CREATE
router.post('/', verifyTokenAndAdmin, async(req, res)=>{
    const newProduct = new ProductModel(req.body)
    try{
        const saveProduct = await newProduct.save()
        res.status(200).json({success:true , data:saveProduct})
    }catch(error){
        res.status(500).json({success:false , error})
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
     const updatedProduct = await ProductModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
    
      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  });

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        await ProductModel.findByIdAndDelete(req.params.id)
        res.status(200).json({success:true, message:"Product has been deleted..."})
    }catch(error){
        res.status(500).json({success:false, error})
    } 
})

//GET PRODUCT
router.get("/find/:id", async(req, res)=>{
    try{
       const getProduct = await ProductModel.findById(req.params.id)
        res.status(200).json({success:true, product:getProduct })
    }catch(error){
        res.status(500).json({success:false, error})
    } 
})

//GET ALL PRODUCTS
router.get("/", async(req, res)=>{
    console.log("its working...")
    let products;
    try{
        const queryNew = req.query.new;
        const queryCategory = req.query.category;
        if(queryNew){
            products = await ProductModel.find().sort({createdAt: -1}).limit(1)
        }else if(queryCategory){
            products = await ProductModel.find({
                catagories:{
                    $in : queryCategory
                }
            })
        }else{
            products = await ProductModel.find()
            console.log("products", products)
        }
        res.status(200).json({success:true, products:products})
    }catch(error){
        res.status(500).json({success:false, error})
    } 
})

module.exports = router
