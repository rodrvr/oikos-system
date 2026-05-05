const express = require("express");
const router = express.Router();
const verseController = require("../controllers/verse.controller");

router.get("/daily", verseController.getDaily);

module.exports = router;
