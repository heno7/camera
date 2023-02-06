const { User, PassCode } = require("../databases");
const { JWT } = require("../utils");

async function findUserById(id) {
  try {
    const user = await User.findById(id);
    if (!user) return null;
    return user;
  } catch (error) {
    throw error;
  }
}

async function findUserByPhone(number) {
  try {
    const user = await User.findOne({
      phoneNumber: number,
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw error;
  }
}

async function savePassCode(userId, passCode) {
  try {
    const newPassCode = new PassCode({
      userId,
      passCode,
    });
    await newPassCode.save();
  } catch (error) {
    throw error;
  }
}

async function checkPassCode(passCode) {
  try {
    const existPassCode = await PassCode.findOne({ passCode }).populate(
      "userId"
    );
    if (existPassCode) return existPassCode;
    return false;
  } catch (error) {
    throw error;
  }
}

module.exports = { findUserById, findUserByPhone, savePassCode, checkPassCode };
