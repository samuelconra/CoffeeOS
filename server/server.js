import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.config.js";
import { globalErrorHandler } from "./src/middlewares/error.middleware.js";
import AppError from "./src/utils/AppError.js";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import coffeeShopRoutes from "./src/routes/coffeeShop.routes.js";
import beanOriginRoutes from "./src/routes/beanOrigin.routes.js";
import zoneRoutes from "./src/routes/zone.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/coffee-shops", coffeeShopRoutes);
app.use("/beans", beanOriginRoutes);
app.use("/zones", zoneRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to CoffeeOS API ☕️");
});

// app.all("*", (req, res, next) => {
//   next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
// });

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running -> http://localhost:${PORT}`);
});
