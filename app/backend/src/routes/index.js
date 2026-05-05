const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const eventRoutes = require("./event.routes");
const inscriptionRoutes = require("./inscription.routes");
const requestRoutes = require("./request.routes");
const newsRoutes = require("./news.routes");
const verseRoutes = require("./verse.routes");
const churchRoutes = require("./church.routes");

router.get("/", (req, res) => {
  res.json({ message: "Oikos API running" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/inscriptions", inscriptionRoutes);
router.use("/requests", requestRoutes);
router.use("/news", newsRoutes);
router.use("/verse", verseRoutes);
router.use("/churches", churchRoutes);

module.exports = router;
