const { promisify } = require("util");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const signPromise = promisify(JWT.sign);
const verifyPromise = promisify(JWT.verify);
const genSaltPromise = promisify(bcrypt.genSalt);
const hashPromise = promisify(bcrypt.hash);
const comparePromise = promisify(bcrypt.compare);

async function hashPassword(password) {
  try {
    const salt = await genSaltPromise(11);
    const hashedPassword = await hashPromise(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

async function comparePassword(password, hashedPassword) {
  try {
    const result = await comparePromise(password, hashedPassword);
    return result;
  } catch (error) {
    throw error;
  }
}

async function generateToken(payload, secret, options) {
  try {
    const token = await signPromise(payload, secret, options);
    return token;
  } catch (error) {
    throw error;
  }
}

// function asyncWrapper(...params) {
//   return async function (...params) {
//     try {
//       await excutionFunction(...params);
//     } catch (error) {
//       throw error;
//     }
//   };
// }

const { generatePassCode, sendPassCode } = require("./SMS_sender");

module.exports = {
  JWT: {
    generateToken,
    verifyPromise,
  },
  bcrypt: {
    comparePassword,
    hashPassword,
  },
  SMS: {
    sendPassCode,
    generatePassCode,
  },
};
