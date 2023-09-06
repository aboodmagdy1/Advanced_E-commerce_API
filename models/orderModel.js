const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must belong to  a user "],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxPrice: {
      //admin sittings
      type: Number,
      default: 0,
    },
    shippingAdress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    shippingPrice: {
      //admin sittings
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDeliverd: {
      type: Boolean,
      default: false,
    },
    deliverdAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name phone email" }).populate({
    path: "cartItems.product",
    select: "title imageCover",
  });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
