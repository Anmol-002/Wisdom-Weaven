const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser=require("cookie-parser")
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://wisdom-weaven.netlify.app");
   res.setHeader("Access-Control-Allow-Methods", ['GET','POST','PUT','DELETE','PATCH']);
   res.setHeader("Access-Control-Allow-Credentials", "true");
   res.setHeader("Content-Type", "application/json");
  
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});
// Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(errorMiddleware);

module.exports = app;
