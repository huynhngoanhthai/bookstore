const { Schema, model, Types, set } = require("mongoose");

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minlength: [3, "Must be at least 3 character "],
    },
    description: {
      type: String,
    },
    author: String,
    price: {
      type: Number,
      required: [true, "price is required "],
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
    },
  },
  {
    collection: "nb-books",
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    // toObject: { virtuals: true },
  }
);
set("runValidators", true);
BookSchema.virtual("author_detail", {
  ref: "users",
  localField: "author",
  foreignField: "email",
  justOne: true,
});
// BookSchema.virtual("Category", {
// })
const Books = model("book", BookSchema);
module.exports = Books;
