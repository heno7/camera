const mongoose = require("mongoose");
const User = require("./models/users.model");
const PassCode = require("./models/passCode.model");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

module.exports = { User, PassCode };
