const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.use(authMiddleware);

router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/", roleMiddleware("PASTOR", "PRESIDENTE"), userController.create);
router.put("/:id", userController.update);
router.delete("/:id", roleMiddleware("PASTOR", "PRESIDENTE"), userController.delete);

module.exports = router;
