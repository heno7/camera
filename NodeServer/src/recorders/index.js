const path = require("path");
const fse = require("fs-extra");
const helpers = require("../utils");
const frameStreamFactory = require("./frameStream");
const Saver = require("./saver");

module.exports = {
  listOfStores: {},
  listOfFrameStreams: {},
  listOfSaver: {},
  isRunning: false,

  async initStore() {
    const pathToStore = path.resolve("store");
    console.log(pathToStore);
    const camConfigs = await helpers.getCameraConfigs();
    let listPros = [];
    for (let camId in camConfigs) {
      listPros.push(
        fse.ensureDir(path.join(pathToStore, `raw_store_${camId}`))
      );
      listPros.push(
        fse.ensureDir(path.join(pathToStore, `pro_store_${camId}`))
      );
    }
    await Promise.all(listPros);
  },

  async init() {
    const configs = await helpers.getCameraConfigs();
    await this.initStore();
    for (let camId in configs) {
      const time = Date.now();
      // console.log(__filename);
      // console.log(__dirname);
      this.listOfStores[camId] = path.join(
        path.resolve("store", `raw_store_${camId}`),
        `${time}.mp4`
      );
      // console.log(this.listOfStores[camId]);
      this.listOfFrameStreams[camId] = frameStreamFactory();
      this.listOfSaver[camId] = new Saver(
        this.listOfStores[camId],
        this.listOfFrameStreams[camId]
      );
    }
  },

  routing(frame) {
    if (!this.isRunning) return;
    // console.log(frame);
    let currentCamId = new Uint8Array(frame.slice(12, 13))[0];
    if (currentCamId < 10) currentCamId = "0" + currentCamId;
    // console.log(currentCamId);
    this.listOfFrameStreams[currentCamId].push(frame);
  },

  run(connectCameras) {
    if (connectCameras.length === 0) return;
    for (let cameraWS of connectCameras) {
      //   console.log(this.listOfSaver[cameraWS.camId]);
      if (cameraWS.OPEN && !this.listOfSaver[cameraWS.camId].isSaving) {
        this.listOfSaver[cameraWS.camId].save();
        this.listOfSaver[cameraWS.camId].isSaving = true;
      }
    }
    this.isRunning = true;
  },

  close(connectCameras) {
    for (let cameraWS of connectCameras) {
      if (!cameraWS.OPEN) {
        this.listOfFrameStreams[cameraWS.camId].push(null);
      }
      this.listOfFrameStreams[cameraWS.camId].push(null);
    }
    this.isRunning = false;
  },

  clear() {
    this.listOfStores = {};
    this.listOfFrameStreams = {};
    this.listOfSaver = {};
    this.isRunning = false;
  },

  setDuration(duration, connectCameras) {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(async () => {
      console.log("here");
      this.close(connectCameras);
      this.clear();
      await this.init();
      this.run(connectCameras);
    }, duration);
    return this;
  },
};
