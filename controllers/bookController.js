const catchAsync = require("../middleware/async");
const Books = require("../models/Book");
// const ApiError = require("../utils/ApiError");

exports.getBooks = catchAsync(async (req, res) => {
  const books = await Books.find()
    .populate("author_detail", "name email -_id ")
    .populate("category", "name description -_id");
  res.json({
    success: true,
    data: books,
  });
});
exports.getBookDetail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const book = await Books.findById(id);
  res.json({
    success: true,
    book: book,
  });
});

exports.createBook = catchAsync(async (req, res) => {
  const { title, price, description, category } = req.body;
  const author = req.user.email;
  const book = await Books.create({
    title,
    author,
    price,
    category,
    description,
  });
  res.json({
    success: true,
    data: book,
  });
});
//admin
exports.deleteBook = catchAsync(async (req, res) => {
  const { id } = req.params;
  const author = req.user.email;
  await Books.deleteOne({ _id: id, author });
  res.json({
    success: true,
  });
});
//guest
exports.updateBook = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { title, description, price } = req.body;
  const author = req.user.email;
  const book = await Books.findOneAndUpdate(
    { _id: id, author },
    { title, description, price },
    { new: true }
  );
  res.json({
    success: true,
    data: book,
  });
});
