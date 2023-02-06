const JWT = require("jsonwebtoken");
const { promisify } = require("util");
const verifyPromise = promisify(JWT.verify);
const fs = require("fs");
const path = require("path");

const cert = fs.readFileSync(path.resolve("src/auth", "public.pem")); // get public key

const serverId = "123";

module.exports = {
  authenticator: async (req, res, next) => {
    try {
      const { accessToken } = req.body;
      if (!accessToken)
        return res.status(401).json({ message: "Access denied!" });
      const payload = await verifyPromise(accessToken, cert);
      console.log(payload);
      if (payload.homeServerId === serverId) {
        return next();
      }
      return res.status(401).json({ message: "Access denied!" });
    } catch (error) {
      //   console.log(error);
      next(error);
    }
  },
};
