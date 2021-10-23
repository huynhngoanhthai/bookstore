const rateLimit = require("express-rate-limit");
const limiter = (maxReq, minutes) =>
  rateLimit({
    windowMs: minutes * 60 * 1000, // 15 minutes
    max: maxReq, // limit each IP to 100 requests per windowMs
    message: "too many requests",
  });

module.exports = limiter;
