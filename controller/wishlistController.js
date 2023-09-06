const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//@desc  Get logged user wishlist
//@route Get /api/v1/wishlist
//@access protected/user
exports.getLoggedUserWishlist = asyncHandler(async (req,res) => {
    const user =  await User.findById(req.user._id).populate("wishlist")

    res.status(200).json({
        status:'success',
        results:user.wishlist.length,
        data: user.wishlist
    })
})

//@desc  Add Product to wishlist
//@route POST /api/v1/wishlist
//@access protected/user
exports.addProductToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
    //add productId to wishlist array if productId not exist
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }// to return the document after update
  );

  res.status(200).json({
    status: 'success',
    message:"Product added successfully to wishlist",
    data:user.wishlist
  })
});

//@desc  Remove Product from wishlist
//@route Delete /api/v1/wishlist/:productId
//@access protected/user

exports.deleteProductFromWishlist = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { wishlist: req.params.productId },//remove from wishlist
        },
        { new: true }// to return the document after update
      );
    
      res.status(200).json({
        status: 'success',
        message:"Product removed successfully from wishlist",
        data:user.wishlist
      })});
