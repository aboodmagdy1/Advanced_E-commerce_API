const express = require("express");
const cors = require("cors");
const compression = require("compression");
const stripe = require("stripe")(process.env.STRIPE_SECRET_kEY);
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const morgan = require("morgan"); // to logging the Http Requests
const AppError = require("./util/AppError");
const dbConnection = require("./config/database");
const globalHandlerMiddleware = require("./middleware/errorMiddleware");
const mountRoutes = require("./routes/index");
const { webhookCheckout } = require("./controller/orderController");

//security packages
const { rateLimit } = require("express-rate-limit"); //limit number or requsts on specific route like reset password (in this case send sms is costs so we must make limit)
const hpp = require("hpp");
const mongoSanitize = require('express-mongo-sanitize')
//dbConnection
dbConnection();
//express
const app = express();
//enable athor domains to access your applications
app.use(cors());
app.options("*", cors()); //in case of update image in frontend

app.use(compression()); //compress all the returned responses.....

//checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

//middleware
//pody parser (express.json )must be before any security 
app.use(express.json({ limit: "20kb" })); //convert the json format to js object (req.body form json to object )
//security applay
//1)data sanitize (call it self every time there is json data) prevent from noSQL query injection($and .)
app.use(mongoSanitize())
//prevent form melisos scription and html

//2)set requset body size limit to prevent server moemory or resources te be misused
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  message: "Too many requsets  from this Ip , please try again after an hour ",
});

//3) middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp({ whitelist: ["price", "sold", "quantity"] })); //witelist to allow specific filed to be repeted


//to serve the static files like images in browser (go the browser the urel loaclhost:300/categories/imageName) it will get the image from the server
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("mode is development");
} else {
  console.log(`mode is ${process.env.NODE_ENV}`);
}

app.use("/api", limiter);

//Routes
mountRoutes(app);
//unHandled routes (cathc the routes that i don't make it like /api/(v2)/categories)
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find this route : ${req.originalUrl}`, 400)); //send it to erro handling middleware
});

//Global error handler middlware for express  ,,,,,
app.use(globalHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App  is running on port ${PORT} `);
});

// security)unhandled rejection (from promises) >>(out of express like db error )
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejectiion Errors : ${err.name}|${err.message}`);
  server.close(() => {
    console.error("Shutting down");
    process.exit(1);
  });
});
