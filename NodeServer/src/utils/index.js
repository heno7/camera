const fs = require("fs/promises");
const path = require("path");

module.exports = {
  pathToConfig: path.resolve(__dirname, "../config/camera.config.json"),
  async getConfigs() {
    try {
      const textConfig = await fs.readFile(this.pathToConfig);
      return JSON.parse(textConfig);
    } catch (error) {
      throw error;
    }
  },

  async setConfigs(configs) {
    try {
      const oldConfigs = await this.getConfigs();
      const newConfigs = { ...oldConfigs, ...configs };
      await fs.writeFile(this.pathToConfig, JSON.stringify(newConfigs));
      return newConfigs;
    } catch (error) {
      throw error;
    }
  },
};
