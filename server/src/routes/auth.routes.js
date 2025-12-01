import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { handleAsync } from "../middlewares/error.middleware.js";

const router = Router();

router.post("/login", handleAsync(login));
router.post("/register", handleAsync(register));

export default router;
