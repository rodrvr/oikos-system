require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const routes = require("./src/routes");
const errorMiddleware = require("./src/middlewares/error.middleware");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Demasiadas solicitudes, intenta más tarde" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos de autenticación, intenta más tarde" },
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(limiter);
app.use("/auth", authLimiter);
app.use(routes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
