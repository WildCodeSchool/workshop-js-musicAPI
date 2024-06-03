const express = require("express"); // import express
const router = require("../api/router"); // import the main router

const app = express(); // Initialize a express server
app.use(express.json()); // Apply a global middlewares to parse incoming request data to json
app.use("/api", router); // Apply the main router to the endpoint /api

const errorHandler = async (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Log the error to the console for debugging purposes
  console.error(err);
  console.error("on req:", req.method, req.path);

  res.status(500).json("Internal Server Error");
};

app.use(errorHandler); // Apply the error middleware globally

module.exports = app; // export your server config
