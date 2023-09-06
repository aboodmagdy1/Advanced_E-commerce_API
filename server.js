const express = require("express");

// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require("cors");
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const compression = require("compression");

const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });
const morgan = require("morgan"); // to logging the Http Requests
const AppError = require("./util/AppError");
const dbConnection = require("./config/database");
const globalHandlerMiddleware = require("./middleware/errorMiddleware");
const mountRoutes = require("./routes/index");

//dbConnection
dbConnection();
//express
const app = express();
//enable athor domains to access your applications
app.use(cors());
app.options("*", cors()); //in case of update image in frontend

app.use(compression()); //compress all the returned responses.....
//middleware
app.use(express.json()); //convert the json format to js object (req.body form json to object )
//to serve the static files like images in browser (go the browser the urel loaclhost:300/categories/imageName) it will get the image from the server
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("mode is development");
} else {
  console.log(`mode is ${process.env.NODE_ENV}`);
}

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

// unhandled rejection (from promises) >>(out of express like db error )
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejectiion Errors : ${err.name}|${err.message}`);
  server.close(() => {
    console.error("Shutting down");
    process.exit(1);
  });
});
