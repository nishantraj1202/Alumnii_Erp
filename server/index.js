require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/request");

const app = express();
app.use(express.json());
app.use(cors({ origin: "https://alumnii-erp.vercel.app" }));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use("/requests", requestRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
