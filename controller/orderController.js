const stripe = require("stripe")(process.env.STRIPE_SECRET_kEY);
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModle");
const AppError = require("../util/AppError");

//@desc  Create Order
//@route POST /api/v1/orders/:cartId
//@access public/protected/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  //app Sittings (admin only make this fields)
  const taxPrice = 0;
  const shippingPrice = 0;
  //1)Get cart based on cartId
  const { cartId } = req.params;
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new AppError(`There is no cart with this id:${cartId}`, 404));
  }
  //2)Get orderPrice based on cartPrice "check if coupon applayed we will get price after discount"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  //3)Create order with default paymentMethodType(cash)
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAdress: req.body.shippingAdress,
  });

  //4)update product data in Db like available quantitiy and sold ==> incarce sold and decriment quantity
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    //5)clear delete  depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

exports.filterOrdersForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});
//@desc  get All Orders
//@route Get /api/v1/orders
//@access protected/admin,manager/user
exports.getAllOrders = factory.getAll(Order);

//@desc   get one Order
//@route  Get /api/v1/order/orderId
//@access protected/admin,manager,user
exports.getOrder = factory.getOne(Order);

//@desc   Update Order paid status to paid
//@route  Get /api/v1/order/:orderId/deliverd
//@access protected/admin,manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  // 1)get order
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(
      new AppError(`There is no order with id ${req.params.orderId}`, 404)
    );
  }
  //2)update order paid status
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

//@desc   Update Order Deliverd status to deliverd
//@route  Get /api/v1/order/:orderId/deliverd
//@access protected/admin,manager
exports.updateOrderToDeliverd = asyncHandler(async (req, res, next) => {
  // 1)get order
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(
      new AppError(`There is no order with id ${req.params.orderId}`, 404)
    );
  }
  //2)update order paid status
  order.isDeliverd = true;
  order.deliverdAt = Date.now();
  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

//@desc   Get Checkout  session from stripe and send it as a response
//@route  Get /api/v1/orders/checkout-session/cartId(cartId to get price )
//@access protected/admin,manager
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  //app Sittings (admin only make this fields)
  const taxPrice = 0;
  const shippingPrice = 0;
  //1)Get cart based on cartId
  const { cartId } = req.params;
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new AppError(`There is no cart with this id:${cartId}`, 404));
  }
  //2)Get orderPrice based on cartPrice "check if coupon applayed we will get price after discount"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  //3)Create  stripe checkout session

  const session = await stripe.checkout.sessions.create({
    //info about the session
    client_reference_id: req.params.cartId, // unique id for checkout session
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`, //dynamic route to user orders
    cancel_url: `${req.protocol}://${req.get("host")}/cart`, // dynamic route to user cart

    //info about user
    customer_email: req.user.email,
    //info about the product

    line_items: [
      {
        price_data: {
          unit_amount: totalOrderPrice * 100, //we do 100 because stripe if num is 1000  appr 10 an so on
          currency: "usd",
          product_data: {
            name: "product",
          },
        },
        quantity: 1,
      },
    ],

    metadata: req.body.shippingAdressb,
  });

  // 4)send session to response
  res.status(200).json({
    status: "success",
    session,
  });
});



const createCardOrder= async (session)=>{
  const cartId = session.client_reference_id
  const shippingAdress = session.metadata 
  const orderPrice = session.total_details[0]

  const cart = await Cart.findById(cartId)
  const user = await User.findOne({email:session.customer_email})

    //3)Create order with  paymentMethodType(card)
    const order = await Order.create({
      user:user._id,
      cartItems: cart.cartItems,
      totalOrderPrice:orderPrice,
      shippingAdress,
      isPaid:true,
      paidAt:Date.now(),
      paymentMethodType:'card',

    });

    if (order) {
      const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      }));
      await Product.bulkWrite(bulkOption, {});
  
      //5)clear delete  depend on cartId
      await Cart.findByIdAndDelete(cartId);
    }
  
}

//@desc   thsi webhook will run when the stripe payment is complete
//@route  post /webhook-checkout
//@access protected/user
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    createCardOrder(event.data.object)
  }

  res.status(200).json({received :true})
});
