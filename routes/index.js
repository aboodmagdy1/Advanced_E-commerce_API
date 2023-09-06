//Routers
const categoryRoute = require("./categoryRoute");
const subCategoryRouter = require("./subCategoryRoute");
const brandRouter = require("./brandRoute");
const productRouter = require("./productRoute");
const userRouter = require("./userRoute");
const authRouter = require("./authRoute");
const reviewRouter = require("./reviewRoutes");
const wishlistRouter = require("./wishlistRoute");
const adressesRouter = require("./adressesRoute");
const couponRouter = require("./couponRoute");
const cartRouter = require("./cartRoute");
const orderRouter = require("./orderRoute");




const mountRoutes = (app)=>{
app.use("/api/v1/categories", categoryRoute); // use the category route to handle the http methods in ths rescourse
app.use("/api/v1/subCategories", subCategoryRouter); // use the subCategory route to handle the http methods in ths rescourse
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/adresses", adressesRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

}

module.exports = mountRoutes