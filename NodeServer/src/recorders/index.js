const helpers = require("../utils");
const frameStreamFactory = require("./frameStream");
const Saver = require("./saver");

module.exports = {
  listOfStores: {},
  listOfFrameStreams: {},
  listOfSaver: {},
  isRunning: false,
  async init() {
    const configs = await helpers.getConfigs();
    for (let camId in configs) {
      this.listOfStores[camId] = camId + configs[camId] + ".mp4";
      this.listOfFrameStreams[camId] = frameStreamFactory();
      this.listOfSaver[camId] = new Saver(
        this.listOfStores[camId],
        this.listOfFrameStreams[camId]
      );
    }
  },

  routing(frame) {
    if (!this.isRunning) return;
    console.log(frame);
    let currentCamId = frame.slice(12, 13).toString();
    if (currentCamId.length === 1) currentCamId = "0" + currentCamId;
    console.log(currentCamId);
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
    }
  },
};
