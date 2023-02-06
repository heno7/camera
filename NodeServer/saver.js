const path = require("path");
const fs = require("fs/promises");

const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegStatic);

class Saver {
  constructor(store, stream) {
    this.store = store;
    // this.frameQueu = [];
    // this.id = 0;
    this.isSaving = false;
    this.stream = stream;
  }

  // add(data) {
  //   this.frameQueu.push(data);
  //   if (this.isSaving) {
  //     return;
  //   } else {
  //     this.save(this.frameQueu.shift());
  //     this.isSaving = true;
  //   }
  // }

  // async createTempImageFile(data) {
  //   try {
  //     await fs.writeFile(`./store/frame-${this.id}.jpeg`, data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async save(data) {
    this.isSaving = true;
    // await this.createTempImageFile(data);
    ffmpeg()
      // FFmpeg expects your frames to be named like frame-001.png, frame-002.png, etc.
      .input(this.stream)
      // .inputFormat("jpeg")
      // Tell FFmpeg to import the frames at 10 fps
      .inputOptions("-framerate", "10")
      .input("video.mp4")

      // Use the x264 video codec
      .videoCodec("libx264")

      // Use YUV color space with 4:2:0 chroma subsampling for maximum compatibility with
      // video players
      .outputOptions("-pix_fmt", "yuv420p")

      // Output file
      .saveToFile("video.mp4")

      // Log the percentage of work completed
      .on("progress", (progress) => {
        if (progress.percent) {
          console.log(`Processing: ${Math.floor(progress.percent)}% done`);
        }
      })

      // The callback that is run when FFmpeg is finished
      .on("end", () => {
        console.log("FFmpeg has finished.");
        // this.isSaving = false;
        // this.id++;
      })

      // The callback that is run when FFmpeg encountered an error
      .on("error", (error) => {
        console.error(error);
      });
  }
}

module.exports = Saver;
