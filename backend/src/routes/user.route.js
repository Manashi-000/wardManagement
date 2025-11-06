import { Router } from "express";
import { loginController, signUpController,getUserCount } from "../controllers/user.controller.js";
import { adminAuthMiddleware } from "../middlewares/user.auth.js";
const router = Router();

router.post("/login", loginController);
router.post("/signup", signUpController);
router.get("/count",adminAuthMiddleware,getUserCount);

export default router;
