const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URL, () => {
    console.log("create a bookstore");
  });
};
module.exports = connectDB;
