const { default: mongoose } = require("mongoose");
const monggose = require("mongoose");

const Product = require("./productModle");

const reviewSchema = new monggose.Schema(
  {
    title: {
      type: "String",
    },
    ratings: {
      type: "Number",
      required: [true, "review must have ratings "],
      min: [1, "min rating value is 1.0"],
      max: [5, "max rating value is 5.0"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must belong to user "],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "review must belong to Product "],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});
reviewSchema.statics.calcAverageRantingAndQuantity = async function (productId) 
{
  const result = await this.aggregate([
    //Stage 1 : catch all review on specific product based on the productId
    { $match: { product: productId } },
    //Stage 2 :group reviews beased on productId and calc avgRatings and reatingQuantity
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};
//to make the findAndUpdate tirgger this event we go to the handler of update and save the doc before send it in the response
reviewSchema.post("save", async function () {
  //this. constructor return the review model
  await this.constructor.calcAverageRantingAndQuantity(this.product);
})

reviewSchema.post("findOneAndDelete", async  (document)=> {
  await document.constructor.calcAverageRantingAndQuantity(document.product);
});

module.exports = monggose.model("Review", reviewSchema);
