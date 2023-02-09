const express = require("express");
const router = express();

const fs = require("fs/promises");
const path = require("path");

const { authenticator } = require("./auth/auth.middleaware");
const helpers = require("./utils");

// router.use(authenticator);

router.get("/client", (req, res) => {
  return res.sendFile(
    path.resolve(__dirname, "./new_clients/dynamic_clients.html")
  );
});

router.get("/client/configs", async (req, res, next) => {
  try {
    const configs = await helpers.getConfigs();
    return res.status(200).json(configs);
  } catch (error) {
    next(error);
  }
});

router.post("/config", async (req, res, next) => {
  try {
    const config = req.body.config;
    const newConfigs = await helpers.setConfigs(config);
    return res.status(200).json({ newConfigs });
  } catch (error) {
    next(error);
  }
});

router.get("/client/records/meta", async (req, res, next) => {
  try {
    const configs = await helpers.getConfigs();
    const response = {};
    for (let camId in configs) {
      const pathToStore = path.resolve("store", `pro_store_${camId}`);
      const listOfRecords = await fs.readdir(pathToStore);
      response[camId] = listOfRecords;
    }
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
