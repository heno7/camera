const { Readable } = require("stream");

const frameStream = new Readable({
  read() {},
});

module.exports = frameStream;

// const arrayBuffer = message.data;
// var blobObj = new Blob([arrayBuffer]);
