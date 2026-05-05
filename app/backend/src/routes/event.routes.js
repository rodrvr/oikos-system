const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/global", eventController.getGlobal);

router.use(authMiddleware);

router.get("/", eventController.getAll);
router.get("/:id", eventController.getById);
router.post("/", eventController.create);
router.put("/:id", eventController.update);
router.delete("/:id", eventController.delete);

module.exports = router;
