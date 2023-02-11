const fs = require("fs");
const path = require("path");

let jwtPrivateKey;

try {
  jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
  jwtPrivateKey = fs.readFileSync(path.resolve("./src", "./jwt/private.pem"));
} catch (error) {
  jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
}

module.exports = {
  MONGO_URL: process.env.MONGO_URL,
  JWT_ALG: process.env.JWT_ALG,
  JWT_PRIVATE_KEY: jwtPrivateKey,
  JWT_ACCESS_TOKEN_EXPIRE: process.env.JWT_ACCESS_TOKEN_EXPIRE,
  accountSid: process.env.SMS_ID,
  authSMSToken: process.env.SMS_API_KEY,
};
