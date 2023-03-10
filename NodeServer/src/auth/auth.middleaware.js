const JWT = require("jsonwebtoken");
const { promisify } = require("util");
const verifyPromise = promisify(JWT.verify);
const fs = require("fs");
const path = require("path");
const helpers = require("../utils");

const cert = fs.readFileSync(path.resolve("src/auth", "public.pem")); // get public key

function handleTokenError(error, res) {
  if (error.name === "TokenExpiredError") {
    return res.status(400).json({ message: "you must provide valid passcode" });
  }
}

module.exports = {
  authenticator: async (req, res, next) => {
    try {
      let accessToken;
      // if(!req.query.tk) accessToken = req.body.tk;
      accessToken = req.query.tk;
      // console.log(req.query);
      // console.log(accessToken);
      if (!accessToken)
        return res.status(401).json({ message: "Access denied!" });
      const payload = await verifyPromise(accessToken, cert);
      const serverConfigs = await helpers.getServerConfigs();
      if (payload.homeServerId === serverConfigs.serverId) {
        return next();
      }
      return res.status(401).json({ message: "Access denied!" });
    } catch (error) {
      //   console.log(error);
      next(error);
    }
  },
};
