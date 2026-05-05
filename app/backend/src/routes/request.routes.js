const express = require("express");
const router = express.Router();
const requestController = require("../controllers/request.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/", requestController.getAll);
router.get("/:id", requestController.getById);
router.post("/", requestController.create);
router.put("/:id", requestController.update);

module.exports = router;
