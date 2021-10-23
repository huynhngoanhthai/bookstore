const ApiError = require("../utils/ApiError");
const authorize =
  (...roles) =>
  (req, res, next) => {
    const role = req.user.role;
    if (!role || !roles.includes(role)) {
      throw new ApiError(403, "No law");
    }
    next();
  };
module.exports = authorize;
