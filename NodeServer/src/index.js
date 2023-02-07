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

app.use(express.static(path.resolve(__dirname, "./new_clients")));
app.get("/client", authenticator, (req, res) => {
  // res.sendFile(path.resolve(__dirname, "./clients/client.html"));
  res.sendFile(path.resolve(__dirname, "./new_clients/dynamic_clients.html"));
});

app.get("/config", authenticator, (req, res, next) => {
  fs.readFile(
    path.resolve(__dirname, "./config/camera.config.json"),
    (err, data) => {
      if (err) next(err);
      return res.status(200).json({ config: JSON.parse(data) });
    }
  );
});

app.post("/config", authenticator, (req, res, next) => {
  const config = req.body.config;
  const pathToConfig = path.resolve(__dirname, "./config/camera.config.json");
  fs.readFile(pathToConfig, (err, data) => {
    if (err) next(err);
    const oldConfig = JSON.parse(data);
    const newConfig = { ...oldConfig, config };
    fs.writeFile(pathToConfig, JSON.stringify(newConfig), (err) => {
      if (err) return next(err);
      return res.status(200).json({ newConfig });
    });
  });
});

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
    checkTypeOfClient(ws, data);

    connectedClients.forEach((ws, i) => {
      if (connectedClients[i] == ws && ws.readyState === ws.OPEN) {
        ws.send(data);
        frameStream.push(data);
      } else {
        connectedClients.splice(i, 1);
      }
    });
  });

  ws.on("close", () => {
    if (connectedClients.includes(this)) {
      console.log("A client is exited!");
      return;
    }
    console.log("A camera is disconnected!");
    frameStream.push(null);
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
    runSaver();
    return;
  }
}

function runSaver() {
  if (connectedCameras.length > 0 && !saver.isSaving) {
    console.log("Hello");
    saver.save();
    saver.isSaving = true;
  }
}
