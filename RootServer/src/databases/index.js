const mongoose = require("mongoose");
const User = require("./models/users.model");
const PassCode = require("./models/passCode.model");

const config = require("../config");

(async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

module.exports = { User, PassCode };
