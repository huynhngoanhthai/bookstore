const catchAsync = require("../middleware/async");
const category = require("../models/Category");

exports.getCategories = catchAsync(async (req, res) => {
  const categories = await category.find();
  res.status(200).json({
    success: true,
    categories: categories,
  });
});
exports.createCategory = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const categories = await category.create({ name, description });
  res.status(200).json({
    success: true,
    categories: categories,
  });
});
