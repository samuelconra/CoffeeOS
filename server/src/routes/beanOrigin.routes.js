import { Router } from "express";
import * as controller from "../controllers/beanOrigin.controller.js";
import { handleAsync } from "../middlewares/error.middleware.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateToken);

// GET /beans
router.get("/", handleAsync(controller.getBeanOrigins));

// GET /beans/:id
router.get("/:id", handleAsync(controller.getBeanOriginById));

// POST /beans
router.post("/", handleAsync(controller.createBeanOrigin));

// PATCH /beans
router.patch("/:id", handleAsync(controller.updateBeanOrigin));

// DELETE /beans
router.delete("/:id", handleAsync(controller.deleteBeanOrigin));

export default router;
