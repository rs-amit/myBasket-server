const router = require("express").Router();
const { User } = require("../models/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./VerifyToken");

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SEC_PASSWORD
    ).toString();
  }
  try {
   const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
  
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async(req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({success:true, message:"user has been deleted..."})
    }catch(error){
        res.status(500).json({success:false, error})
    } 
})

//GET USERS
router.get("/find/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
       const getUser = await User.findById(req.params.id)
       const {password, ...others} = getUser._doc;
        res.status(200).json({success:true, user:others })
    }catch(error){
        res.status(500).json({success:false, error})
    } 
})

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async(req, res)=>{
    try{
        const query = req.query.new;
        const getUser = query ? await User.find().sort({_id: -1}).limit(1) : await User.find()
        res.status(200).json({success:true, users:getUser })
    }catch(error){
        res.status(500).json({success:false, error})
    } 
})

//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });

  

module.exports = router;
