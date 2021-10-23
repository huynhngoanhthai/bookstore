const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  {
    collection: "nd-Category",
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
