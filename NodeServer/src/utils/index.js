const fs = require("fs/promises");
const path = require("path");

module.exports = {
  pathToCameraConfig: path.resolve(__dirname, "../config/camera.config.json"),
  pathToServerConfig: path.resolve(__dirname, "../config/server.config.json"),
  async getCameraConfigs() {
    try {
      const textConfig = await fs.readFile(this.pathToCameraConfig);
      return JSON.parse(textConfig);
    } catch (error) {
      throw error;
    }
  },

  async setCameraConfigs(configs) {
    try {
      const oldConfigs = await this.getCameraConfigs();
      const newConfigs = { ...oldConfigs, ...configs };
      await fs.writeFile(this.pathToCameraConfig, JSON.stringify(newConfigs));
      return newConfigs;
    } catch (error) {
      throw error;
    }
  },

  async getServerConfigs() {
    try {
      const textConfig = await fs.readFile(this.pathToServerConfig);
      return JSON.parse(textConfig);
    } catch (error) {
      throw error;
    }
  },

  async setSeverConfigs(config) {
    try {
      const oldConfigs = await this.getServerConfigs();
      const newConfigs = { ...oldConfigs, ...configs };
      await fs.writeFile(this.pathToServerConfig, JSON.stringify(newConfigs));
      return newConfigs;
    } catch (error) {
      throw error;
    }
  },
};
