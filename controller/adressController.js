const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//@desc  Get logged user adresses
//@route Get /api/v1/adresses
//@access protected/user
exports.getLoggedUserAdresses = asyncHandler(async (req,res) => {
  const user =  await User.findById(req.user._id)
  
  res.status(200).json({
    status:'success',
    results:user.adresses.length,
    data: user.adresses
  })
})

//@desc  Add adress to userAdresses
//@route POST /api/v1/adresses
//@access protected/user
//add adres object to array of adresses
exports.addAdress = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { adresses: req.body },
    },
    { new: true }// to return the document after update
  );

  res.status(200).json({
    status: 'success',
    message:"adress added successfully ",
    data:user.adresses
  })
});

//@desc  Remove adress 
//@route Delete /api/v1/adresses/:adressId
//@access protected/user

exports.deleteAdress = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { adresses: {_id:req.params.adressId}},
        },
        { new: true }// to return the document after update
      );
    
      res.status(200).json({
        status: 'success',
        message:"adress removed successfully",
        data:user.adresses
      })});
