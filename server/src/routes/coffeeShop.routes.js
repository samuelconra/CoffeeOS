import { Router } from "express";
import * as controller from "../controllers/coffeeShop.controller.js";
import { handleAsync } from "../middlewares/error.middleware.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateToken);

// GET /coffee-shops
router.get("/", handleAsync(controller.getCoffeeShops));

// GET /coffee-shops/:id
router.get("/:id", handleAsync(controller.getCoffeeShopById));

// POST /coffee-shops
router.post("/", handleAsync(controller.createCoffeeShop));

// PATCH /coffee-shops
router.patch("/:id", handleAsync(controller.updateCoffeeShop));

// DELETE /coffee-shops
router.delete("/:id", handleAsync(controller.deleteCoffeeShop));

export default router;
