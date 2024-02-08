const { log } = require("console");
const app = require("./app");
const cloudinary = require("cloudinary");
const mongoDB = require("./database");

require("dotenv").config();

// Handling Uncaught Exception- ye error aata hai agr undefined cheeze likh de jese niche commented hai. agr koi code chedta hai aur kuch glt likh deta hai toh server close hojega
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});
// console.log(youtube)

// connecting to database
// connectDatabase();

// image upload krne k liye cloudinary use krrhe
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`Running on Port : ${process.env.PORT}`);
});

// Unhandled Promise Rejection- invalid mongoose uri jisse connection establish hota hai
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
