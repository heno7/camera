const path = require("path");
const fs = require("fs/promises");

const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");

console.log(ffmpegStatic);

ffmpeg.setFfmpegPath(ffmpegStatic);

const { Converter } = require("ffmpeg-stream");

class Saver {
  constructor(store, stream) {
    this.store = store;
    this.isSaving = false;
    this.stream = stream;
  }

  async save(data) {
    // create converter
    console.log("Saving...");
    const converter = new Converter();
    // create input writable stream (the jpeg frames)
    const converterInput = converter.createInputStream({
      f: "image2pipe",
      vcodec: "mjpeg",
      r: 30,
    });
    converter.createOutputToFile("out.mp4", {
      vcodec: "libx264",
      pix_fmt: "yuv420p",
    });

    const convertingFinished = converter.run();
    this.stream.pipe(converterInput, { end: false });
    this.stream.on("end", () => {
      converterInput.end();
      this.isSaving = false;
    });

    await convertingFinished;
  }
}

module.exports = Saver;
