const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const catchError = require("./middleware/error");
const bookRouter = require("./routers/bookRouter");
const authRouter = require("./routers/authRouter");
const wordRouter = require("./routers/wordRouter");
const randomRouter = require("./routers/randomPasswordRouter");
const categoryRouter = require("./routers/categoryRouter");
const limiter = require("./middleware/limiter");
const app = express();

const EmailService = require("./utils/sendEmail");
EmailService.init();

connectDB();
app.use(express.json());
app.use(cors());
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/random", randomRouter);
app.use("/api/v1/word", wordRouter);
//middleware
app.use(catchError);
//limit each IP to 100 requests per windowMs in 15'

if (process.env.NODE_ENV === "production") app.use(limiter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT} `);
});
// app.listen(process.env.PORT || 5000);
