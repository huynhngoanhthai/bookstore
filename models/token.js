const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    token: {
      type: String,
    },
  },
  { collection: "nd-token", timestamps: true }
);

tokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: +process.env.TOKEN_EXPIRED }
);

module.exports = mongoose.model("token", tokenSchema);
