const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const denoiseRoute = require("./routes/denoiser");

const app = express();
const PORT = 1234;

// Middleware to parse JSON and files

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", denoiseRoute);

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
