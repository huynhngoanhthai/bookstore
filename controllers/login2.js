const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");

const redisClient = new Redis({
  options: {
    enableOfflineQueue: false,
  },
});

const opts = {
  redis: redisClient,
  points: 5, // 5 points
  duration: 15 * 60, // Per 15 minutes
  blockDuration: 15 * 60, // block for 15 minutes if more than points consumed
};
const rateLimiter = new RateLimiterRedis(opts);

app.post("/auth", (req, res, next) => {
  const loggedIn = loginUser();
  if (!loggedIn) {
    // Consume 1 point for each failed login attempt
    rateLimiter
      .consume(req.connection.remoteAddress)
      .then((data) => {
        // Message to user
        res.status(400).send(data.remainingPoints + " attempts left");
      })
      .catch((rejRes) => {
        // Blocked
        const secBeforeNext = Math.ceil(rejRes.msBeforeNext / 1000) || 1;
        res.set("Retry-After", String(secBeforeNext));
        res.status(429).send("Too Many Requests");
      });
  } else {
    // successful login
  }
});
