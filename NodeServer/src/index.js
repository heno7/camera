const path = require("path");
const fs = require("fs");
const https = require("https");
const express = require("express");
const { WebSocketServer } = require("ws");

// const frameStream = require("./recorders/frameStream");
// const Saver = require("./recorders/saver");

// const saver = new Saver("camera.mp4", frameStream);

const recoders = require("./recorders");

(async () => {
  await recoders.init();
})();

// const { recordReducerJob } = require("./crons");
// recordReducerJob.start();

const app = express();

const HTTPS_PORT = 443;

const router = require("./routes");

app.use(express.json());

app.use(express.static(path.resolve(__dirname, "./new_clients")));

app.use("/client/records/", express.static(path.resolve("./store", "")));

app.use("/", router);

app.use((err, req, res, next) => {
  console.log(err);
  return res.status(500).json({ message: "Internal server error!" });
});

const httpsServer = https
  .createServer(
    {
      cert: fs.readFileSync("./certificates/fullchain.pem"),
      key: fs.readFileSync("./certificates/privkey.pem"),
    },
    app
  )
  .listen(HTTPS_PORT, () => {
    console.log(`Secure server is running...`);
  });

const wssServer = new WebSocketServer({ server: httpsServer });

let connectedCameras = [];
let connectedClients = [];
wssServer.on("connection", (ws, req) => {
  console.log("Connected");

  ws.on("message", (data) => {
    const type = checkTypeOfClient(ws, data);
    if (type === "camera") return;
    if (type === "client") return;
    recoders.routing(data);
    connectedClients.forEach((ws, i) => {
      if (connectedClients[i] == ws && ws.readyState === ws.OPEN) {
        ws.send(data);
        // frameStream.push(data);
        // recoders.routing(data);
      } else {
        connectedClients.splice(i, 1);
      }
    });
  });

  ws.on("close", function () {
    if (connectedClients.includes(this)) {
      console.log("A client is exited!");
      connectedClients.splice(connectedClients.indexOf(this), 1);
      recoders.close(connectedCameras);
      return;
    }
    console.log("A camera is disconnected!");
    // frameStream.push(null);
    recoders.close(connectedCameras);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error observed: ", error);
  });
});

function checkTypeOfClient(ws, data) {
  if (data.indexOf("WEB_CLIENT") !== -1) {
    connectedClients.push(ws);
    console.log("Client connected");
    return "client";
  }
  if (data.indexOf("Camera") !== -1) {
    ws.camId = data.slice(7, 9).toString();
    // console.log(ws.camId);
    connectedCameras.push(ws);
    console.log("Camera connected");
    // runSaver();
    recoders.setDuration(60 * 1000, connectedCameras).run(connectedCameras);
    // recoders.run(connectedCameras);
    return "camera";
  }
}

// function runSaver() {
//   if (connectedCameras.length > 0 && !saver.isSaving) {
//     console.log("Hello");
//     saver.save();
//     saver.isSaving = true;
//   }
// }
