const express = require("express");
const router = express.Router();
const churchController = require("../controllers/church.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/my-church", authMiddleware, churchController.getMyChurch);
router.get("/", churchController.getAll);
router.get("/:id", churchController.getById);

module.exports = router;
