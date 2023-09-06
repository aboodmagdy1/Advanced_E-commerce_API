const asyncHandler = require("express-async-handler");
const AppError = require("../util/AppError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModle");
const Coupon = require("../models/couponModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;

  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined; // to hide it from res when add product to cart
  return totalPrice;
};

// @desc    Get logged User Cart
// @route   Get /api/v1/cart
// @access  Protect/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError(`There is no cart for logged user`, 404));
  }
  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: {
      cart,
    },
  });
});
// @desc    Add Product TO Cart
// @route   POST /api/v1/cart
// @access  Protect/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  //1)check cart of  logged user  if exist
  const { productId, color } = req.body;
  const product = await Product.findOne({ _id: productId });
  let cart = await Cart.findOne({ user: req.user._id });

  //if there is no cart for logged user create one
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: { product: productId, color, price: product.price },
    });
    //if logged user have a cart
  }
  //if cart exist
  else {
    //check if this product exist or noe
    //1.A)if exist in the same data and color incrace the quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
    } //1.B)if not exist pust to cartItems
    else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  //2)calc cartTotalPrice
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added successfully to cart",
    numberOfCartItems: cart.cartItems.length,
    data: {
      cart,
    },
  });
});

// @desc    Remove Product From Cart
// @route   Delete /api/v1/cart/:itemId .....not productId ......
// @access  Protect/User
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );

  calcTotalCartPrice(cart);
  cart.save();
  res.status(200).json({
    status: "success",
    message: "Product removed  successfully from cart",
    numberOfCartItems: cart.cartItems.length,
    data: {
      cart,
    },
  });
});

// @desc    clear logged User cart 
// @route   Delete /api/v1/cart
// @access  Protect/User
exports.clearCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndDelete({ user: req.user._id })

      res.status(204).send()
  });


// @desc    update item quantity
// @route   update /api/v1/cart/:itemId .....not productId ......
// @access  Protect/User
exports.updateProductQuientity = asyncHandler(async (req, res, next) => {
    const {quantity} = req.body
    const cart = await Cart.findOne({user:req.user._id})
    if(!cart){
        return next(new AppError("no cart for logged user ",404))
    }

    const itemIndex = cart.cartItems.findIndex(item => item._id.toString()=== req.params.itemId)

    if(itemIndex >-1){
        const cartItem = cart.cartItems[itemIndex]
        cartItem.quantity = quantity
        cart.cartItems[itemIndex] = cartItem
    }else{
        return next(new AppError("there is no item for this Id ",404))
    }

    calcTotalCartPrice(cart)
    await cart.save()
    res.status(200).json({
        status: "success",
        message: "Product quantity successfully updated",
        numberOfCartItems: cart.cartItems.length,
        data: {
          cart,
        },
      });

})


// @desc    applay coupon on cart
// @route   update /api/v1/cart/applaycoupon
// @access  Protect/User
exports.applayCoupon = asyncHandler(async (req, res,next) => {
    //1)get the coupon based on name and chek if its not expired
    const coupon = await Coupon.findOne({name:req.body.coupon,expire:{$gt:Date.now()}})
    if(!coupon) {
        return next(new AppError("Coupon is expired or invalid "))
    }
    //2)get canrt and get totalprice 
    const cart = await Cart.findOne({user:req.user._id})
    const {totalCartPrice} = cart

    // 3)calc totalprice after discount
    const totalPriceAfterDiscount =( totalCartPrice - (totalCartPrice * coupon.discount) /100).toFixed(2)
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount
    await cart.save()

    res.status(200).json({
        status: "success",
        numberOfCartItems: cart.cartItems.length,
        data: {
          cart,
        },
      });

})