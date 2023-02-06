"use strict";

const path = require("path");
const fs = require("fs");
const https = require("https");
const express = require("express");
const { WebSocketServer } = require("ws");
const app = express();

// const HTTPS_PORT = 443;

app.use(express.static("."));
app.get("/client", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client.html"));
});

const httpsServer = https.createServer(
  {
    cert: fs.readFileSync("./certificates/cert.pem"),
    key: fs.readFileSync("./certificates/key.pem"),
  },
  app
);
//   .listen(HTTPS_PORT, () => {
//     console.log("Server is running...");
//   });

const wssServer = new WebSocketServer({ server: httpsServer });

let connectedClients = [];
wssServer.on("connection", (ws, req) => {
  console.log("Connected");

  ws.on("message", (data) => {
    if (data.indexOf("WEB_CLIENT") !== -1) {
      connectedClients.push(ws);
      console.log("WEB_CLIENT ADDED");
      return;
    }

    connectedClients.forEach((ws, i) => {
      if (connectedClients[i] == ws && ws.readyState === ws.OPEN) {
        ws.send(data);
      } else {
        connectedClients.splice(i, 1);
      }
    });
  });

  ws.on("error", (error) => {
    console.error("WebSocket error observed: ", error);
  });
});

module.exports = app;
