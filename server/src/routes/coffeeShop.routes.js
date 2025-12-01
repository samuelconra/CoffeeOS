import { Router } from "express";
import { getCoffeeShops } from "../controllers/coffeeShop.controller.js";
import { handleAsync } from "../middlewares/error.middleware.js";

const router = Router();

router.get("/", handleAsync(getCoffeeShops));

export default router;
