const path = require("path");
const fs = require("fs");
const https = require("https");
const express = require("express");
const { WebSocketServer } = require("ws");

const frameStream = require("../frameStream");
const Saver = require("../saver");

const saver = new Saver("camera.mp4", frameStream);
const app = express();

const HTTPS_PORT = 443;

const { authenticator } = require("./auth/auth.middleaware");

app.use(express.json());

app.use(express.static(path.resolve(__dirname, "./clients")));
app.get("/client", authenticator, (req, res) => {
  res.sendFile(path.resolve(__dirname, "./clients/client.html"));
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
  // if (connectedCameras.length > 0 && !saver.isSaving) {
  //   console.log("Hello");
  //   saver.save();
  // }

  ws.on("message", (data) => {
    checkTypeOfClient(ws, data);

    connectedClients.forEach((ws, i) => {
      if (connectedClients[i] == ws && ws.readyState === ws.OPEN) {
        ws.send(data);
        // saver.add(data);
        // frameStream.push(data);
      } else {
        connectedClients.splice(i, 1);
      }
    });
  });

  ws.on("error", (error) => {
    console.error("WebSocket error observed: ", error);
  });
});

function checkTypeOfClient(ws, data) {
  if (data.indexOf("WEB_CLIENT") !== -1) {
    connectedClients.push(ws);
    console.log("Client connected");
    return;
  }
  if (data.indexOf("Camera") !== -1) {
    connectedCameras.push(ws);
    console.log("Camera connected");
    return;
  }
}
