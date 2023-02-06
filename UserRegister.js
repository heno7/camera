const mongoose = require("mongoose");

const { Schema } = mongoose;

const userRegisterSchema = new Schema({
  username: {
    type: String,
    minLength: 3,
    maxLength: 30,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m",
  },
});

module.exports = mongoose.model("UserRegister", userRegisterSchema);
