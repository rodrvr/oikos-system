const express = require("express");
const router = express.Router();
const inscriptionController = require("../controllers/inscription.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.use(authMiddleware);

router.post("/", inscriptionController.create);
router.get("/event/:id", inscriptionController.getByEvent);
router.put("/:id", roleMiddleware("ADMIN_EVENTOS", "PASTOR"), inscriptionController.update);

module.exports = router;
