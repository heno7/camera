const authControllers = require("./auth.controllers");

const router = require("express").Router();

router.post("/passcode", authControllers.createPassCode);

router.post("/login", authControllers.login);

module.exports = router;
