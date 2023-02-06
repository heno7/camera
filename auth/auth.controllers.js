const Joi = require("joi");
const { registerSchema, loginSchema } = require("./auth.validations");

const {
  checkExistUser,
  createNewUser,
  generateTokens,
  checkCredentials,
} = require("./auth.services");

module.exports = {
  register: async (req, res, next) => {
    try {
      const validatedReqBody = await registerSchema.validateAsync(req.body);
      const { username, email, password } = validatedReqBody;

      const checkExistResult = await checkExistUser({ username, email });
      if (checkExistResult.existUser) {
        return res.status(400).json({ message: checkExistResult.message });
      }

      const newUser = await createNewUser({ username, email, password });

      const { access_token, refresh_token } = await generateTokens(
        {
          id: newUser.userId,
          username: newUser.username,
        },
        {
          id: newUser.userId,
          ip: req.ip,
        }
      );

      return res.status(200).json({
        access_token,
        refresh_token,
      });
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        return res.status(400).json({ message: error.details[0].message });
      }
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const validatedReqBody = await loginSchema.validateAsync(req.body);
      const { email, password } = validatedReqBody;
      console.log(email, password);

      const user = await checkCredentials({ email, password });
      if (!user) {
        res.status(400).json({ message: "email or password is invalid!" });
      }

      const { access_token, refresh_token } = await generateTokens(
        {
          id: user.userId,
          username: user.username,
        },
        {
          id: user.userId,
          ip: req.ip,
        }
      );

      return res.status(200).json({
        access_token,
        refresh_token,
      });
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        return res.status(400).json({ message: error.details[0].message });
      }
      next(error);
    }
  },
  getAccessToken: async (req, res, next) => {},
  logout: async (req, res, next) => {},
};
