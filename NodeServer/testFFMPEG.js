const ffmpegStatic = require("ffmpeg-static");
const ffprobe = require("ffprobe-static");
const ffmpeg = require("fluent-ffmpeg");

// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobe.path);

// ffmpeg.ffprobe("./video.mp4", function (err, metadata) {
//   console.dir(metadata);
// });
const path = require("path");
// Run FFmpeg
ffmpeg()
  // FFmpeg expects your frames to be named like frame-001.png, frame-002.png, etc.
  .input("frame-002.png")

  // Tell FFmpeg to import the frames at 10 fps
  .inputOptions("-framerate", "10")

  .input("video.mp4")
  // Use the x264 video codec
  .videoCodec("libx264")

  // Use YUV color space with 4:2:0 chroma subsampling for maximum compatibility with
  // video players
  .outputOptions("-pix_fmt", "yuv420p")

  // Output file
  .mergeToFile("video2.mp4", path.resolve("./store/"))

  // Log the percentage of work completed
  .on("progress", (progress) => {
    if (progress.percent) {
      console.log(`Processing: ${Math.floor(progress.percent)}% done`);
    }
  })

  // The callback that is run when FFmpeg is finished
  .on("end", () => {
    console.log("FFmpeg has finished.");
  })

  // The callback that is run when FFmpeg encountered an error
  .on("error", (error) => {
    console.error(error);
  });
