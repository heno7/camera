const router = require("express").Router();
const {
  register,
  login,
  getAccessToken,
  logout,
} = require("./auth.controllers");

router.post("/register", register);
router.post("/login", login);
router.get("/access-token", getAccessToken);
router.post("/logout", logout);

module.exports = router;
