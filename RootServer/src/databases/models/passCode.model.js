const mongoose = require("mongoose");
const { Schema } = mongoose;

const passCodeSchema = new Schema({
  passCode: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m",
  },
});

const PassCode = mongoose.model("PassCode", passCodeSchema);

module.exports = PassCode;
