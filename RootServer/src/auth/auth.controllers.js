const config = require("../config");

const { SMS, JWT } = require("../utils");
const {
  findUserById,
  findUserByPhone,
  savePassCode,
  checkPassCode,
} = require("./auth.services");

module.exports = {
  createPassCode: async (req, res, next) => {
    try {
      const { phoneNumber } = req.body;
      const user = await findUserByPhone(phoneNumber);
      if (!user)
        return res.status(400).json({ message: "Invalide phone number!" });
      const passCode = SMS.generatePassCode();
      await savePassCode(user.id, passCode);
      SMS.sendPassCode(phoneNumber, passCode);
      res.send("Test");
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { passCode } = req.body;
      const isValidPassCode = await checkPassCode(passCode);
      if (!isValidPassCode) {
        return res.status(401).json({ message: "Invalide passcode!" });
      }
      const user = findUserById(isValidPassCode.userId);

      const accessToken = await JWT.generateToken(
        {
          homeServerId: user.homeServerId,
        },
        config.JWT_PRIVATE_KEY,
        { algorithm: config.JWT_ALG, expiresIn: config.JWT_ACCESS_TOKEN_EXPIRE }
      );

      return res.status(201).json({
        domain: user.domain,
        accessToken: accessToken,
      });
    } catch (error) {
      next(error);
    }
  },
};