import { Router } from "express";
import { loginController, signUpController } from "../controllers/user.controller.js";

const router = Router();

router.post("/login", loginController);
router.post("/signup", signUpController);

export default router;
