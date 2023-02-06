const fs = require("fs");
const path = require("path");

module.exports = {
  MONGO_URL: process.env.MONGO_URL,
  JWT_ALG: "RS256",
  JWT_PRIVATE_KEY: fs.readFileSync("../jwt/private.pem"),
  JWT_ACCESS_TOKEN_EXPIRE: "1h",
};
