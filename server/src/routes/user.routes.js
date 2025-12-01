import { Router } from "express";
import { getUsers } from "../controllers/user.controller.js";
import { handleAsync } from "../middlewares/error.middleware.js";

const router = Router();

router.get("/", handleAsync(getUsers));

export default router;
