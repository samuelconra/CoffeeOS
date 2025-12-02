import { Router } from "express";
import * as controller from "../controllers/zone.controller.js";
import { handleAsync } from "../middlewares/error.middleware.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateToken);

// GET /zones
router.get("/", handleAsync(controller.getZones));

// POST /zones
router.post("/", handleAsync(controller.createZone));

// DELETE /zones:id
router.delete("/:id", handleAsync(controller.deleteZone));

export default router;