require("dotenv").config();
const path = require("path");

const express = require("express");
const app = express();

require("./databases");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.resolve("src/clients")));

const authRoutes = require("./auth/auth.routes");

app.use("/auth", authRoutes);

app.listen(3333, () => {
  console.log("Root server is running...");
});
