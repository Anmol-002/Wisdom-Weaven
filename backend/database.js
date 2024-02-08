const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
var MongoClient = require("mongodb").MongoClient;
const mongoURI =
  // "mongodb+srv://Gofood:E1GxipsTTecvNnm6@cluster0.kvpqjdz.mongodb.net/GoFood?retryWrites=true&w=majority";
  "mongodb+srv://2021kucp1090:1090@cluster0.nhiyij2.mongodb.net/?retryWrites=true&w=majority";
// "mongodb+srv://Gofood:E1GxipsTTecvNnm6@cluster0.kvpqjdz.mongodb.net/GoFood?retryWrites=true&w=majority";
const mongoDB = async () => {
  await mongoose.connect(
    mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    async (err, client) => {
      if (err) console.log(err);
      else {
        console.log("connected to database");
      }
    }
  );
};

module.exports = mongoDB();
