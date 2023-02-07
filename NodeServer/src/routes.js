const express = require("express");
const router = express();

const fs = require("fs");
const path = require("path");

const { authenticator } = require("./auth/auth.middleaware");
const helpers = require("./utils");

router.get("/client", authenticator, (req, res) => {
  res.sendFile(path.resolve(__dirname, "./new_clients/dynamic_clients.html"));
});

router.get("/config", authenticator, async (req, res, next) => {
  try {
    const configs = await helpers.getConfigs();
    return res.status(200).json({ configs });
  } catch (error) {
    next(error);
  }
});

router.post("/config", authenticator, async (req, res, next) => {
  try {
    const config = req.body.config;
    const newConfigs = await helpers.setConfigs(config);
    return res.status(200).json({ newConfigs });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
