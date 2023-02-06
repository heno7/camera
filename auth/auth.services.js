const {
  User,
  Sequelize: { Op },
} = require("../databases/models");

const { JWT, bcrypt } = require("../utils/utils");

async function checkExistUser({ username, email }) {
  try {
    const oldUser = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });
    if (oldUser && oldUser.username === username) {
      return {
        existUser: true,
        message:
          "Opps! username has been used, please choose difference usernames",
      };
    }
    if (oldUser && oldUser.email === email) {
      return {
        existUser: true,
        message: "Opps! email has been used, please choose difference emails",
      };
    }
    return {
      existUser: false,
    };
  } catch (error) {
    throw error;
  }
}

async function createNewUser({ username, email, password }) {
  try {
    const hashedPassword = await bcrypt.hashPassword(password);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return newUser;
  } catch (error) {
    throw error;
  }
}

async function generateTokens(accessPayload, refreshPayload) {
  try {
    const access_token = await JWT.generateToken(
      accessPayload,
      process.env.JWT_SECRET_KEY,
      {
        algorithm: "RS256",
        expiresIn: "15m",
      }
    );

    const refresh_token = await JWT.generateToken(
      refreshPayload,
      process.env.JWT_SECRET_KEY,
      {
        algorithm: "RS256",
        expiresIn: "3d",
      }
    );

    return { access_token, refresh_token };
  } catch (error) {
    throw error;
  }
}

async function checkCredentials({ email, password }) {
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const existUser = await bcrypt.comparePassword(password, user.password);
      if (existUser) {
        return user;
      }
    }
    return false;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  checkExistUser,
  createNewUser,
  generateTokens,
  checkCredentials,
};
