const express = require("express");
const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// POST /api/denoise
router.post("/denoise", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = path.join(__dirname, "../uploads", req.file.filename);
  const pythonScript = path.join(__dirname, "../denoiser.py");

  console.log(imagePath);
  console.log(pythonScript);
  console.log("Starting python script");
  
  exec(`.venv/bin/python3.10 "${pythonScript}" "${imagePath}"`, (err, stdout, stderr) => {
    fs.unlinkSync(imagePath); // Clean up uploaded file

    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: "Python script failed" });
    }
    const base64Pattern = /^[A-Za-z0-9+/=]+$/;
    const lines = stdout.split("\n").map(line => line.trim());
    const base64Line = lines.find(line => base64Pattern.test(line));

    if (!base64Line) {
      return res.status(500).json({ error: "Failed to extract image" });
    }

    res.json({ denoisedImage: base64Line });
  });
});

module.exports = router;
