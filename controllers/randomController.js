const generator = require("generate-password");

const catchAsync = require("../middleware/async");

exports.random = catchAsync((req, res) => {
  const { length, numbers, symbols } = req.body;

  var password = generator.generate({
    length,
    numbers,
    symbols,
  });

  res.json({
    success: true,
    password,
  });
});
