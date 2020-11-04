const express = require( "express");
const path = require("path");

const router = express.Router();


router.use(express.static(path.resolve("./build/")));


router.get("/", (req, res) => {
  res.sendFile(path.resolve("./build/index.html"));
});

module.exports = router;