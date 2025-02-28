require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/request");

const app = express();
app.use(express.json());
const allowedOrigins = [
  "https://alumnii-erp.vercel.app",
  "http://localhost:5173", // for local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use("/requests", requestRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
