const mongoose = require("mongoose");
require("dotenv").config();
const URL = process.env.MongoURL;
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(URL);
    console.log("your database is connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;
