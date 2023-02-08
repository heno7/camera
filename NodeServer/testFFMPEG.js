const path = require("path");
const concat = require("ffmpeg-concat");

// concat 3 mp4s together using 2 500ms directionalWipe transitions
const pathToStore = path.resolve("store", "store_01");

console.log(pathToStore);
(async () => {
  await concat({
    output: "test.mp4",
    videos: [
      path.join(pathToStore, "1675841993957_01.mp4"),
      path.join(pathToStore, "1675842283432_01.mp4"),
      path.join(pathToStore, "1675842343434_01.mp4"),
    ],
    transition: {
      name: "directionalWipe",
      duration: 500,
    },
  });
})();
