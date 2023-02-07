const { Readable } = require("stream");

const frameStreamFactory = function () {
  return new Readable({
    read() {},
  });
};

module.exports = frameStreamFactory;

// const arrayBuffer = message.data;
// var blobObj = new Blob([arrayBuffer]);
