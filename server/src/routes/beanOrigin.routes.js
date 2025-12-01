import { Router } from "express";
import { getBeanOrigins } from "../controllers/beanOrigin.controller.js";
import { handleAsync } from "../middlewares/error.middleware.js";

const router = Router();

router.get("/", handleAsync(getBeanOrigins));

export default router;
