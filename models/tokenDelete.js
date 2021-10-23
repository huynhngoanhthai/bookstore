const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenDeleteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600, //1h
    },
  },
  { collection: "nd-tokenDelete" }
);

module.exports = mongoose.model("tokenDelete", tokenDeleteSchema);
