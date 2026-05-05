const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/", newsController.getAll);
router.post("/", authMiddleware, roleMiddleware("PASTOR", "ADMIN_EVENTOS"), newsController.create);
router.put("/:id", authMiddleware, roleMiddleware("PASTOR", "ADMIN_EVENTOS"), newsController.update);
router.delete("/:id", authMiddleware, roleMiddleware("PASTOR", "ADMIN_EVENTOS"), newsController.delete);

module.exports = router;
