require("dotenv").config();

const express = require("express");
const app = express();

require("./databases");

app.use(express.json());

const authRoutes = require("./auth/auth.routes");

app.use("/auth", authRoutes);

app.listen(3333, () => {
  console.log("Root server is running...");
});
