const fs = require("fs/promises");
const helpers = require("../utils");

const path = require("path");
const concat = require("ffmpeg-concat");

// concat 3 mp4s together using 2 500ms directionalWipe transitions

reducerVideos();

async function reducerVideos() {
  const configs = await helpers.getConfigs();
  const storePaths = [];
  for (let camId in configs) {
    const pathToStore = path.resolve("store", `raw_store_${camId}`);
    storePaths.push(pathToStore);
  }
  for (let storePath of storePaths) {
    filterVideos(storePath);
  }
}

async function filterVideos(storePath) {
  const now = Date.now();
  const listOfVideoNames = await fs.readdir(storePath);
  const lessThanNowVideoNames = listOfVideoNames
    .filter((videoName) => {
      const videoTime = parseInt(videoName.split(".")[0]);
      if (videoTime < now) return videoName;
      return false;
    })
    .sort((a, b) => {
      return parseInt(a.split(".")[0]) - parseInt(b.split(".")[0]);
    });
  const lessThanVideoPaths = lessThanNowVideoNames.map((video) =>
    path.join(storePath, video)
  );
  return reducer(
    lessThanVideoPaths,
    path.join(
      path.resolve(
        "store",
        "pro_store_" + storePath.slice(storePath.length - 2)
      ),
      `${lessThanNowVideoNames[0].split(".")[0]}_${
        lessThanNowVideoNames[lessThanNowVideoNames.length - 1].split(".")[0]
      }.mp4`
    )
  );
}

async function reducer(videos, outputName) {
  await concat({
    output: outputName,
    videos: videos,
    transition: {
      name: "directionalWipe",
      duration: 500,
    },
  });
  await deleteVideos(videos.slice(0, videos.length - 1));
}

async function deleteVideos(videos) {
  await Promise.all(videos.map((videoPath) => fs.unlink(videoPath)));
}
